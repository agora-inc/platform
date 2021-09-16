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

	def create_agora_and_get_talk_ids(self, url_agora, user_id, topic_1_id):
		if "https://researchseminars.org/seminar/" not in url_agora:
			return 0, []

		self.driver.get(url_agora)
		if self.driver.find_element_by_id("title").text == 'Page not found':
			return 0, []
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
			return 1, idx, channel['id'], name

	def parse_talks(self, url_agora, idx, time_epoch, logged_in = 0):
		if not logged_in : self._login()

		# Talks
		url_talks = url_agora.replace("/seminar/", "/talk/")
		talks = []
		# ids = ids[:10]
		for i in idx:
			if (time.time() - time_epoch < 28):
				try:
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

					# Speaker 
					talk['speaker'] = self.driver.find_element_by_xpath("//h3").text
					talk['speaker_url'] = RSScraperRepository._get_href(lst_link, talk['speaker'], substring=True)

					# Time
					str_time = self.driver.find_element_by_xpath('//b').text
					talk['start_time'], talk['end_time'] = RSScraperRepository._parse_time(str_time)

					# Description + Comments
					e = self.driver.find_element_by_class_name('talk-details-container')
					lst = e.text.split('\n')[:-3]
					desc_idx = [n for n, txt in enumerate(lst) if txt[:10] == "Audience: "][0]
					talk['description'] = '\n'.join(lst[:desc_idx - 1] + lst[desc_idx:]).replace('Abstract: ', '')

					# Audience level
					talk['audience'] = lst[desc_idx][10:]

					# Link
					talk['link'] = RSScraperRepository._get_href(lst_link, "available")

					# Slides and video
					talk['slides'] = RSScraperRepository._get_href(lst_link, "slides")
					talk['video'] = RSScraperRepository._get_href(lst_link, "video")

					# Save
					talks.append(talk)
					idx.remove(i)

				except Exception as e:
					print(e)
					pass

			if len(idx) == 0 : self.driver.quit()
			logged_in = 1

			return talks, idx , logged_in

	def create_talks(self, url, channel_id, channel_name, idx, topic_1_id, audience_level, visibility, auto_accept_group , time_epoch , logged_in = 0):
		# Get info
		talks , idx , logged_in = self.parse_talks(url, idx, time_epoch, logged_in)

		# Create talks
		for talk in talks:
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
				topic_1_id=topic_1_id, 
				topic_2_id=None, 
				topic_3_id=None,
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

			with open(f"/home/cloud-user/test/talk.txt", "w") as file:
				file.write(str(talk_created))
				
		return talks , idx , logged_in


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









	"""
	def scrape_and_schedule_talk(self, url_agora, talk_id, channel_id, channel_name, topic_1_id, audience_level, visibility, auto_accept_group):
		try:
			# self._login()
			url_talks = url_agora.replace("/seminar/", "/talk/")
			self.driver.get(url_talks + f"/{talk_id}")
			talk = {}
			lst_link = self.driver.find_elements_by_xpath('//a')

			# Title
			talk['title'] = self.driver.find_element_by_xpath("//h1").text

			# Speaker 
			talk['speaker'] = self.driver.find_element_by_xpath("//h3").text
			talk['speaker_url'] = RSScraperRepository._get_href(lst_link, talk['speaker'], substring=True)

			# Time
			str_time = self.driver.find_element_by_xpath('//b').text
			talk['start_time'], talk['end_time'] = RSScraperRepository._parse_time(str_time)

			# Description
			e = self.driver.find_element_by_class_name('talk-details-container')
			lst = e.text.split('\n')
			idx = [n for n, txt in enumerate(lst) if txt[:10] == "Audience: "][0]
			talk['description'] = '\n'.join(lst[:idx]).replace('Abstract: ', '')

			# Link
			talk['link'] = RSScraperRepository._get_href(lst_link, "available")

			# Slides and video
			talk['slides'] = RSScraperRepository._get_href(lst_link, "slides")
			talk['video'] = RSScraperRepository._get_href(lst_link, "video")

			# Create talk
			self.talkRepo.scheduleTalk(
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
				topic_1_id=topic_1_id, 
				topic_2_id=None, 
				topic_3_id=None,
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

			self.driver.quit()

			return 1

		except:
			return 0
	"""









"""
	def get_valid_series_and_ntalks(self, url_agora):
		if "https://researchseminars.org/seminar/" not in url_agora:
			return 0, 0

		self.driver.get(url_agora)
		if self.driver.find_element_by_id("title").text == 'Page not found':
			return 0, 0
		else:
			ids = RSScraperRepository._get_all_talks_id(self.driver.find_elements_by_xpath('//a'))
			return 1, len(ids)

	def parse_agora(self, url_agora):
		self._login()
		self.driver.get(url_agora)
		info = {}

		# Agora name
		info['name'] = self.driver.find_element_by_xpath("//h1").text

		# Description
		description = self.driver.find_elements_by_xpath("//p")[2:]
		description = [e.text for e in description if e.text != '']
		info['description'] = '\n'.join(description)

		# Talks
		url_talks = url_agora.replace("/seminar/", "/talk/")
		info['talks'] = []
		ids = RSScraperRepository._get_all_talks_id(self.driver.find_elements_by_xpath('//a'))
		# ids = ids[:10]

		for i in ids:
			try:
				self.driver.get(url_talks + f"/{i}")
				talk = {}
				lst_link = self.driver.find_elements_by_xpath('//a')

				# Title
				talk['title'] = self.driver.find_element_by_xpath("//h1").text

				# Speaker 
				talk['speaker'] = self.driver.find_element_by_xpath("//h3").text
				talk['speaker_url'] = RSScraperRepository._get_href(lst_link, talk['speaker'], substring=True)

				# Time
				str_time = self.driver.find_element_by_xpath('//b').text
				talk['start_time'], talk['end_time'] = RSScraperRepository._parse_time(str_time)

				# Description
				e = self.driver.find_element_by_class_name('talk-details-container')
				lst = e.text.split('\n')
				idx = [n for n, txt in enumerate(lst) if txt[:10] == "Audience: "][0]
				talk['description'] = '\n'.join(lst[:idx]).replace('Abstract: ', '')

				# Link
				talk['link'] = RSScraperRepository._get_href(lst_link, "available")

				# Slides and video
				talk['slides'] = RSScraperRepository._get_href(lst_link, "slides")
				talk['video'] = RSScraperRepository._get_href(lst_link, "video")

				# Save
				info['talks'].append(talk)

			except:
				pass

		self.driver.quit()

		return info

	def create_agora_and_talks(self, url, userId, topic_1_id, audience_level, visibility, auto_accept_group):
		# Get info
		info = self.parse_agora(url)
		# Create channel
		channel = self.channelRepo.createChannel(info['name'], info['description'], userId, topic_1_id)

		# Create talks
		for talk in info['talks']:
			talk_created = self.talkRepo.scheduleTalk(
				channelId=channel['id'], 
				channelName=info['name'], 
				talkName=talk['title'], 
				startDate=str(talk['start_time']), 
				endDate=str(talk['end_time']), 
				talkDescription=talk['description'], 
				talkLink=talk['link'], 
				talkTags=[], 
				showLinkOffset=15, 
				visibility=visibility, 
				cardVisibility="Everybody", 
				topic_1_id=topic_1_id, 
				topic_2_id=None, 
				topic_3_id=None,
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

			with open(f"/home/cloud-user/test/talk.txt", "w") as file:
				file.write(str(talk_created))
				
		return channel['id'], info['name']
"""













"""
# Talks
fields = ['weekday', 'monthdate', 'time', 'speaker', 'talktitle']
talks_info = {}
for f in fields:
  talks_info[f] = [e.text for e in driver.find_elements_by_class_name(f) if e.text != '']

n_talks = len(talks_info['weekday'])
info['talks'] = [{} for _ in range(n_talks)]
info['talks'] = []

lst_link = driver.find_elements_by_xpath('//a')

def get_talk_title_suffix(l):
  suffix = l.get_attribute("knowl")
  title = l.get_attribute("title")
  if suffix and title and suffix[:5] == "talk/":
    return title, suffix
  else:
    return None

talks_title_suffix = [get_talk_title_suffix(l) for l in lst_link if get_talk_title_suffix(l)]

def parse_talk(title, suffix):
  talk = {}
  driver.get("https://researchseminars.org/" + suffix)
  lst_link = driver.find_elements_by_xpath('//a')
  elements = [e for e in lst_link if e.text == "available"]
  if len(elements) > 0:
    talk['link'] = elements[0].get_attribute('href')
  else:
    talk['link'] = ""

  idx = [n for n, t in enumerate(talks_info['talktitle']) if title == t]
  if len(idx) > 0:
    idx = idx[0]
    for f in fields:
      talk[f] = talks_info[f][idx]
  
  return talk


talks = []

for e in talks_title_suffix:
  title, suffix = e
  info['talks'].append(parse_talk(title, suffix))



for i in range(n_talks):
  print(i)
  # basic info
  for f in fields:
    info['talks'][i][f] = talks_info[f][i]
    

  e = driver.find_elements_by_class_name("talktitle")[i]
  action = webdriver.common.action_chains.ActionChains(driver)
  action.move_to_element_with_offset(e, 13, 13)
  action.click()
  action.perform()

  # talk description
  try:
    e = WebDriverWait(driver, 1).until(
      EC.presence_of_element_located((By.CLASS_NAME, 'talk-details-container'))
    )
    lst = e.text.split('\n')
    idx = [n for n, txt in enumerate(lst) if txt == info['name']][0]
    info['talks'][i]['description'] = '\n'.join(lst[:idx]).replace('Abstract: ', '')
  except TimeoutException:
    info['talks'][i]['description'] = "TBA"
    print("GGGGG")

  driver.refresh()

  if i == 0:
    print("stop")

  driver.find_elements_by_class_name("talktitle")[i].click()
  time.sleep(1)
  # talk link
  lst_link = driver.find_elements_by_xpath('//a')
  elements = [e for e in lst_link if e.text == "available"]
  if len(elements) > 0:
    info['talks'][i]['link'] = elements[0].get_attribute('href')
  else:
    info['talks'][i]['link'] = ""

  driver.refresh()
"""
