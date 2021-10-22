from repository.ChannelRepository import ChannelRepository
from repository.TalkRepository import TalkRepository
from app.databases import agora_db

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from datetime import datetime
import time
import ast
from typing import List


class RSScraperRepository:
	def __init__(self, db=agora_db):
		self.db = db
		self.channelRepo = ChannelRepository(db=db)
		self.talkRepo = TalkRepository(db=db)
		# Set-up selenium
		options = Options()
		options.headless = True
		options.add_argument("--window-size=1920,1200")
		self.driver = webdriver.Chrome(
			options=options, 
			executable_path='/home/cloud-user/plateform/agora/backend/web_app/chromedriver_linux64/chromedriver'
		)
		self._login()
		

	def _login(self):
		USERNAME = "revolutionisingresearch@gmail.com"
		PASSWORD = "234.wer.sdf"
		# Log in 
		self.driver.get("https://researchseminars.org/user/info")
		self.driver.find_element_by_name("email").send_keys(USERNAME)
		self.driver.find_element_by_name("password").send_keys(PASSWORD)
		self.driver.find_element_by_name("submit").click()
		try:
			self.driver.find_element_by_class_name("side-cancel")
			return True
		except NoSuchElementException:
			return False
	
	def _logout(self):
		try:
			self.driver.get("https://researchseminars.org/user/info")
			self.driver.find_element_by_class_name("side-cancel").click()
			return True
		except NoSuchElementException:
			return False

	

	def create_agora_and_get_talk_ids(self, url_agora, user_id, topic_1_id):
		if "https://researchseminars.org/seminar/" not in url_agora:
			return 0, [], -1, ""

		self.driver.get(url_agora)
		if self.driver.find_element_by_id("title").text == 'Page not found':
			return 0, [], -1, ""
		else:
			# Create channel
			name = self.driver.find_element_by_xpath("//h1").text
			description = self.driver.find_elements_by_xpath("//p")[2:]
			description = [e.text for e in description if e.text != '']
			description = '\n'.join(description)
			
			channel = self.channelRepo.getChannelByName(name)
			if not channel:
				channel = self.channelRepo.createChannel(name, description, user_id, topic_1_id)

			# Get talk index
			idx = RSScraperRepository._get_all_talks_id(self.driver.find_elements_by_xpath('//a'))
			
			# Get a link
			if len(idx) > 0:
				url_talks = url_agora.replace("/seminar/", "/talk/")
				self.driver.get(url_talks + f"/{idx[0]}")
				lst_link = self.driver.find_elements_by_xpath('//a') 
				link = RSScraperRepository._get_href(lst_link, "available")
			else:
				link = ""

			self._logout()
			return 1, idx, channel['id'], name, link

	def get_topic_mapping(topic_str: str):
		file = open("topics.txt")
		contents = file.read()
		dictionary = ast.literal_eval(contents)
		file.close()
		
		search_results = []
		if topic_str != None:
			for vals in list(dictionary.values()):
				vals_lower = [x.lower() for x in vals]
				if topic_str.lower() in vals_lower:
					search_results += [list(dictionary.keys())[list(dictionary.values()).index(vals)][1]]
		if(len(search_results)):
			return search_results[-1]
		else:
			return None



	def parse_create_talks(self, url_agora, idx, channel_id, channel_name, talk_link, audience_level, visibility, auto_accept_group):
		# Talks
		url_talks = url_agora.replace("/seminar/", "/talk/")
		talks = []
		
		for i in idx:
			self.driver.get(url_talks + f"/{i}")
			talk = {}
			lst_link = self.driver.find_elements_by_xpath('//a')

			# Title
			talk['title'] = self.driver.find_element_by_xpath("//h1").text

			#Topics
			topics = list(self.driver.find_elements_by_xpath("//p//span[@class='topic_label']"))
			talk['topics'] = [t.text for t in topics][:3]
			if len(talk['topics']) < 3:
				talk['topics'] += [None] * (3 - len(talk['topics']))
			
			talk['topics_parsed'] = []
			for topic_str in talk['topics']:
				talk['topics_parsed'] += [RSScraperRepository.get_topic_mapping(topic_str)]

			# Speaker 
			talk['speaker'] = self.driver.find_element_by_xpath("//h3").text
			talk['speaker_url'] = RSScraperRepository._get_href(lst_link, talk['speaker'], substring=True)

			# Time
			str_time = self.driver.find_element_by_xpath('//b').text
			talk['start_time'], talk['end_time'] = RSScraperRepository._parse_time(str_time)

			# Description + Comments	
			e = self.driver.find_element_by_xpath("//div[@class= 'talk-details-container']")
			lst = []
			for elem in e.find_elements_by_xpath("./child::*"):
				if elem.text != '':
					lst.append(elem.text)
				else:
					break
			desc_idx = [n for n, txt in enumerate(lst) if txt[:10] == "Audience: "][0]
			talk['description'] = '\n'.join(lst[:desc_idx - 1] + lst[desc_idx + 1:]).replace('Abstract: ', '')

			# Audience level
			talk['audience'] = lst[desc_idx][10:]

			# Link
			link = RSScraperRepository._get_href(lst_link, "available")
			talk['link'] = link if link != "" else talk_link

			# Slides and video
			talk['slides'] = RSScraperRepository._get_href(lst_link, "slides")
			talk['video'] = RSScraperRepository._get_href(lst_link, "video")

			# Store in database
			talk_created = self.talkRepo.scheduleTalk(
				channelId=channel_id, 
				channelName=channel_name, 
				talkName=talk['title'], 
				startDate=str(talk['start_time']), 
				endDate=str(talk['end_time']), 
				talkDescription=talk['description'], 
				talkLink=talk['link'], 
				talkTags=[], 
				showLinkOffset=15, 
				visibility=visibility, 
				cardVisibility="Everybody", 
				topic_1_id=83, 
				topic_2_id=84, 
				topic_3_id=85,
				talk_speaker=talk['speaker'], 
				talk_speaker_url=talk['speaker_url'], 
				published=1, 
				audience_level=audience_level, 
				auto_accept_group=auto_accept_group, 
				auto_accept_custom_institutions=False, 
				customInstitutionsIds=[], 
				reminder1=None, 
				reminder2=None, 
				reminderEmailGroup=[],
				email_on_creation=False,
			)

			talks.append(talk_created)

		return talks

	@staticmethod
	def _get_all_talks_id(lst):
		ids = []
		for e in lst:
			suffix = e.get_attribute("knowl")
			title = e.get_attribute("title")
			if suffix and title and suffix[:5] == "talk/":
				ids.append(int(suffix.split('/')[-1]))

		return ids

	@staticmethod
	def _get_href(lst_link, txt, substring=False):
		if substring:
			elements = [e for e in lst_link if e.text in txt and e.text != '']
		else:
			elements = [e for e in lst_link if e.text == txt]
		
		if len(elements) > 0:
			return elements[0].get_attribute('href')
		else:
			return ""

	@staticmethod
	def _parse_time(str_t):
		str_t = str_t.split(" (")[0]
		date, time = str_t.split(', ')
		start, end = time.split('-')
		
		if "-" in date:
			start_time = datetime.strptime(
				" ".join([date, start]), 
				"%d-%b-%Y %H:%M"
			)
			end_time = datetime.strptime(
				" ".join([date, end]),
				"%d-%b-%Y %H:%M"
			)
		else:
			current_year = str(datetime.now().year)
			start_time = datetime.strptime(
				" ".join([current_year, date, start]), 
				"%Y %a %b %d %H:%M"
			)
			end_time = datetime.strptime(
				" ".join([current_year, date, end]), 
				"%Y %a %b %d %H:%M"
			)
			
		return start_time, end_time

	
# TESTING
if __name__ == "__main__":
	scraper = RSScraperRepository()
	url_agora = "https://researchseminars.org/seminar/cogentseminarkkkkk"
	# print(scraper.get_valid_series_and_ntalks(url_agora))
