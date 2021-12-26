from datetime import datetime
import time
import ast
from typing import List
from joblib import Parallel, delayed
from scrapping.BaseScrapper import BaseScrapper
import requests
from bs4 import BeautifulSoup 

from selenium.common.exceptions import NoSuchElementException

from alphabet_detector import AlphabetDetector
ad = AlphabetDetector()


class ResearchSeminarsScrapper(BaseScrapper):
    def __init__(self, 
        params={
            "use_selenium": False,
            "need_primitive_topics": True,
            "repositories": [
                "TalkRepository",
                "ChannelRepository"
                ]
            }
        ):
        super().__init__(params)
		
    def _selenium_login(self):
        USERNAME = "revolutionisingresearch@gmail.com"
        PASSWORD = "234.wer.sdf"

        # Log in 
        self.selenium_driver.get("https://researchseminars.org/user/info")
        self.selenium_driver.find_element_by_name("email").send_keys(USERNAME)
        self.selenium_driver.find_element_by_name("password").send_keys(PASSWORD)
        self.selenium_driver.find_element_by_name("submit").click()
        try:
        	self.selenium_driver.find_element_by_class_name("side-cancel")
        except NoSuchElementException:
            raise Exception
	
    def _selenium_logout(self):
        try:
            self.selenium_driver.get("https://researchseminars.org/user/info")
            self.selenium_driver.find_element_by_class_name("side-cancel").click()
            return True
        except NoSuchElementException:
            return False

    def run(self):
        # GENRAL OVERVIEW OF PREVIOUS CODE:
        # 1. get all seminar urls with topics and topics_dropdown
        # 2. for each seminar url, create an agora + add new talks
        # 3. Delete all duplicates + delete all new additions of talks with newer research_seminar_talk_link
        #
        #
        # CODE STRUCTURE WE WANT:
        # 1. fetch all channel URLs
        # 2. for each channel URL, 
        # # i) check if new channel is in DB
        # # ii) get all past and future events (i.e. title, description, topics, speaker_name, speaker_url)
        # 3. check if line is in DB or not (do so by fetching all talks for a channel and see if its in the list)
        # if not in the list, look if there is one that is close to it
        #
        #
        #
        print("ResearchSeminarScrapper: running")
        print("1/n: Fetching all seminar series URLs")
        seminar_urls = self.fetch_data(data_name="seminar_series_urls")
        for seminar_url in seminar_urls:
            raw_data = 
            scrapped_data = self.scrap_data(raw_data, data_type="seminar_talks")


    def fetch_data(self, data_name="seminar_series_urls", params={}):
        assert(data_name in ["seminar_series_urls", "event_urls"] )

        if data_name == "seminar_series_urls":
            ALL_SERIES_URL = 'https://researchseminars.org/seminar_series'
            content = requests.get(ALL_SERIES_URL)
            soup = BeautifulSoup(content.text, 'html.parser')
            rows = soup.findAll("tr", {"class" : "talk"})
            seminar_urls = []
            print("Scraping researchseminars.org for semianr series .")
            for row in rows:
                href_a = row.find("td", {"class" : "seriesname"}).find("a")
                topic_a = row.find("td", {"class" : "topics"}).find("span", {"class" : "topic_label"}).text
                # Get primitive topic for tag, works most of the time.  
                topic_dropdown = 15
                for vals in [15,17,18,19,89,142,172]:
                    if topic_a.lower() in self.primitive_topics_dic[vals]:
                        topic_dropdown = vals 
                        break
                    
                seminar_urls.append([f"https://researchseminars.org{href_a['href']}",topic_a, topic_dropdown])
                return seminar_urls  

    def scrap_data(self, raw_data, data_type="seminar_series"):
        ALL_SERIES_URL = 'https://researchseminars.org/seminar_series'
        content = requests.get(ALL_SERIES_URL)
        soup = BeautifulSoup(content.text, 'html.parser')
        return soup.findAll("tr", {"class" : "talk"})

    def has_data_already_been_fetched(self, type):
        assert(type in ["seminar_series"])
        pass

    def does_data_need_update(self):
        pass

    def add_new_data_point(self):
        pass
    
    def update_data_point(self):
        pass

# 	def _isEnglish(s):
# 		try:
# 			s.encode(encoding='utf-8').decode('ascii')
# 		except UnicodeDecodeError:
# 			return False
# 		else:
# 			return True

# 	# Remove duplicate talks
# 	def squash(self):
# 		query = '''DELETE t1 FROM Talks t1, Talks t2
# 			WHERE t1.id > t2.id
# 			AND  t1.date =t2.date
# 			AND  t1.name =t2.name
# 			AND  t1.description =t2.description
# 			AND  t1.end_date=t2.end_date
# 			AND t1.talk_speaker = t2.talk_speaker
# 		'''
# 		self.db.run_query(query)

# 	def email_anti_obsfucator(self, email:str, name:str)->str:
# 		temp_email = ""
# 		if('[at]' in email or '_at_' in email or ' at ' in email):
# 			temp_email = email.replace("[at]","@").replace("_at_","@").replace(" at ","@")
		
# 		if('[dot]' in email or '_dot_' in email or ' dot ' in email):
# 			temp_email = temp_email.replace("[dot]",".").replace("_dot_",".").replace(" dot ",".")

# 		if('firstname' in email or 'givenname' in email or 'lastname' in email or 'familyname' in email):
# 			name_list = name.split(" ")
# 			temp_email = temp_email.replace("myfirstname",f"{name_list[0]}").replace("firstname",f"{name_list[0]}").replace("mygivenname",f"{name_list[0]}").replace("givenname",f"{name_list[0]}")
# 			temp_email = temp_email.replace("mylastname",f"{name_list[-1]}").replace("lastname",f"{name_list[-1]}").replace("myfamilyname",f"{name_list[-1]}").replace("familyname",f"{name_list[-1]}")
			
# 		return temp_email

# 	def email_id_obtainer(self, url):
# 		'''Hiding your email ID is futile, we will find it anyways'''
# 		'''Pass a homepage url, then search for all tags with email in text or id ( or even alt text of an image or using cv to convert an image into an email address) , then everything with @ and a domain name, then use email obsfucator along with it for world domination.'''
# 		pass

# 	def create_agora_and_get_talk_ids(self, url_agora, user_id, topic_1_id):
# 		if "https://researchseminars.org/seminar/" not in url_agora:
# 			return 0, [], -1, ""

# 		self.selenium_driver.get(url_agora)
# 		if self.selenium_driver.find_element_by_id("title").text == 'Page not found':
# 			return 0, [], -1, ""
# 		else:
# 			# Create channel
# 			name = self.selenium_driver.find_element_by_xpath("//h1").text
# 			description = self.selenium_driver.find_elements_by_xpath("//p")[2:]
# 			description = [e.text for e in description if e.text != '']
# 			description = '\n'.join(description)

# 			organisers = self.selenium_driver.find_element_by_xpath("//tr[.//*[text()='Organizer:']] | //tr[.//*[text()='Organizers:']] | //tr[.//*[text()='Curator:']] | //tr[.//*[text()='Curators:']]")
# 			ids = organisers.find_elements_by_xpath(".//td[2]//a[@href]")
# 			contactable_organisers = []
# 			for id in ids:
# 				organiser_details = {}
# 				organiser_details['name'] = id.get_attribute('text')
# 				organiser_href = id.get_attribute('href')
# 				if('mailto:' in organiser_href):
# 					organiser_details['email_address'] = organiser_href[6:]
# 				elif('https://' in organiser_href or 'http://' in organiser_href):
# 					organiser_details['homepage'] = organiser_href
# 				contactable_organisers.append(organiser_details)

# 			emails = [contact for contact in contactable_organisers if 'email_address' in contact]
# 			homepages = [contact for contact in contactable_organisers if 'homepage' in contact]

# 			contact = None
# 			if(len(emails)):
# 				contact = emails[0]
# 			elif (len(homepages)):
# 				contact = homepages[0]

# 			print(contactable_organisers)
# 			print(contact)
			
# 			if(self._isEnglish(name)):	
# 				channel = self.channelRepo.getChannelByName(name)
# 				if not channel:
# 					channel = self.channelRepo.createChannel(name, description, user_id, topic_1_id, claimed=0, organiser_contact=contact)

# 				# Get talk index	
# 				idx = self._get_all_talks_id(self.selenium_driver.find_elements_by_xpath('//a'))
				
# 				# Get a link
# 				if len(idx) > 0:
# 					url_talks = url_agora.replace("/seminar/", "/talk/")
# 					self.selenium_driver.get(url_talks + f"/{idx[0]}")
# 					lst_link = self.selenium_driver.find_elements_by_xpath('//a') 
# 					link = self._get_href(lst_link, "available")
# 				else:
# 					link = ""

# 				self._logout()
# 				return 1, idx, channel['id'], name, link
# 			else:
# 				print('Non latin characters detected, not supported by DB')
# 				return 0, [], -1, ""

# 	def get_topic_mapping(topic_str):
# 		file = open("repository/topics.txt")
# 		contents = file.read()
# 		dictionary = ast.literal_eval(contents)
# 		file.close()
		
# 		search_results = []
# 		if topic_str != None:
# 			for vals in list(dictionary.values()):
# 				vals_lower = [x.lower() for x in vals]
# 				if topic_str.lower() in vals_lower:
# 					search_results += [list(dictionary.keys())[list(dictionary.values()).index(vals)][1]]
# 		if(len(search_results)):
# 			return search_results[-1]
# 		else:
# 			return None



# 	def parse_create_talks(self, url_agora, idx, channel_id, channel_name, talk_link, topic_1_id, audience_level, visibility, auto_accept_group):
# 		# Talks
# 		url_talks = url_agora.replace("/seminar/", "/talk/")
# 		talks = []
		
# 		for i in idx:

# 			self.selenium_driver.get(url_talks + f"/{i}")
# 			talk = {}
# 			lst_link = self.selenium_driver.find_elements_by_xpath('//a')

# 			# Title
# 			talk['title'] = self.selenium_driver.find_element_by_xpath("//h1").text

# 			#Topics
# 			topics = list(self.selenium_driver.find_elements_by_xpath("//p//span[@class='topic_label']"))
# 			talk['topics'] = [t.text for t in topics][:3]
# 			if len(talk['topics']) < 3:
# 				talk['topics'] += [None] * (3 - len(talk['topics']))
			
# 			talk['topics_parsed'] = []
# 			for topic_str in talk['topics']:
# 				talk['topics_parsed'] += [RSScraperRepository.get_topic_mapping(topic_str)]

# 			# Speaker 
# 			talk['speaker'] = self.selenium_driver.find_element_by_xpath("//h3").text
# 			talk['speaker_url'] = RSScraperRepository._get_href(lst_link, talk['speaker'], substring=True)

# 			# Time
# 			str_time = self.selenium_driver.find_element_by_xpath('//b').text
# 			talk['start_time'], talk['end_time'] = RSScraperRepository._parse_time(str_time)

# 			# Description + Comments	
# 			e = self.selenium_driver.find_element_by_xpath("//div[@class= 'talk-details-container']")
# 			lst = []
# 			for elem in e.find_elements_by_xpath("./child::*"):
# 				if elem.text != '':
# 					lst.append(elem.text)
# 				else:
# 					break
# 			desc_idx = [n for n, txt in enumerate(lst) if txt[:10] == "Audience: "][0]
# 			talk['description'] = '\n'.join(lst[:desc_idx - 1] + lst[desc_idx + 1:]).replace('Abstract: ', '')

# 			# Audience level
# 			talk['audience'] = lst[desc_idx][10:]

# 			# Link
# 			link = RSScraperRepository._get_href(lst_link, "available")
# 			talk['link'] = link if link != "" else talk_link

# 			# Slides and video
# 			talk['slides'] = RSScraperRepository._get_href(lst_link, "slides")
# 			talk['video'] = RSScraperRepository._get_href(lst_link, "video")

# 			duplicate_check = self.talkRepo.get_similar_talks_for_channel(channelId = channel_id,
# 												channelName = channel_name,
# 												talkName = talk['title'],
# 												startDate=str(talk['start_time']),
# 												endDate=str(talk['end_time']),
# 												talkDescription = talk['description']
# 												)
# 			# check if talk exists
# 			if(duplicate_check == 0):
# 			# Store in database
# 				talk_created = self.talkRepo.scheduleTalk(
# 					channelId=channel_id, 
# 					channelName=channel_name, 
# 					talkName=talk['title'], 
# 					startDate=str(talk['start_time']), 	
# 					endDate=str(talk['end_time']), 
# 					talkDescription=talk['description'], 
# 					talkLink=talk['link'], 
# 					talkTags=[], 
# 					showLinkOffset=15, 
# 					visibility=visibility, 
# 					cardVisibility="Everybody", 
# 					topic_1_id=topic_1_id, 
# 					topic_2_id=talk["topics_parsed"][0], 
# 					topic_3_id=talk["topics_parsed"][1],
# 					talk_speaker=talk['speaker'], 
# 					talk_speaker_url=talk['speaker_url'], 
# 					published=1, 
# 					audience_level=audience_level, 
# 					auto_accept_group=auto_accept_group, 
# 					auto_accept_custom_institutions=False, 
# 					customInstitutionsIds=[], 
# 					reminder1=None, 
# 					reminder2=None, 
# 					reminderEmailGroup=[],
# 					email_on_creation=False,
# 					main_talk_link=url_talks + f"/{i}"
# 				)

# 				talks.append(talk_created)
			
# 			# self.squash()

# 		# Parallel(n_jobs = multiprocessing.cpu_count(), prefer="threads")(delayed(get_talk_details)(i) for i in idx)
# 		# for i in idx:
# 		# 	get_talk_details(i)

# 		return talks

# 	# Wrapper for parse create talks
# 	def convert_seminar_to_agora(self,seminar_url):
# 		try:
# 			print(seminar_url)
# 			is_valid, talk_ids, channel_id, channel_name, link = self.create_agora_and_get_talk_ids(seminar_url[0], 360, seminar_url[2])    
# 			# if(len(talk_ids) and is_valid):
# 			# 	talks = self.parse_create_talks(seminar_url[0],talk_ids,channel_id,channel_name,link,seminar_url[2],'PhD+','Everybody','Everybody')
# 		except (AttributeError, TypeError, IndexError, ValueError) as e:
# 			print(e)

# 	# update talks
# 	def update(self) -> None:
# 		self.squash()
		
# 		#  get new talks
# 		query = '''SELECT t1.* 
# 				from Talks t1, Talks t2
# 				WHERE t1.id > t2.id
# 				AND t1.main_talk_link = t2.main_talk_link;''' 
# 		talks_new = self.db.run_query(query)


# 		#  get old talks
# 		query = '''SELECT t2.* 
# 				from Talks t1, Talks t2
# 				WHERE t1.id > t2.id
# 				AND t1.main_talk_link = t2.main_talk_link;''' 
# 		talks_old = self.db.run_query(query)
		

# 		try:
# 			if(len(talks_old) == len(talks_new)):
# 				# iterate over talks
# 				for talk_new in talks_new:
# 					for talk_old in talks_old:
# 						query = "UPDATE Talks SET "
# 						if(talk_new["main_talk_link"] == talk_old["main_talk_link"] and talk_new['id'] > talk_old['id']):
# 							# calculate set difference
# 							diff = list(set(set(talk_new.items()) - set(talk_old.items())))
# 							print(diff)
# 							for field in diff:
# 								if(field[0] != 'id'):
# 									query += f''' {field[0]} = "{field[1]}"'''
# 						query += f''' WHERE id = {talk_old['id']}'''
# 						print(query)
# 						print('-----------')
# 						self.db.run_query(query)
# 			self.squash()
# 		except Exception as e:
# 			print(e)

# 	@staticmethod
# 	def _get_all_talks_id(lst):
# 		ids = []
# 		for e in lst:
# 			suffix = e.get_attribute("knowl")
# 			title = e.get_attribute("title")
# 			if suffix and title and suffix[:5] == "talk/":
# 				ids.append(int(suffix.split('/')[-1]))

# 		return ids

# 	@staticmethod
# 	def _get_href(lst_link, txt, substring=False):
# 		if substring:
# 			elements = [e for e in lst_link if e.text in txt and e.text != '']
# 		else:
# 			elements = [e for e in lst_link if e.text == txt]
		
# 		if len(elements) > 0:
# 			return elements[0].get_attribute('href')
# 		else:
# 			return ""

# 	@staticmethod
# 	def _parse_time(str_t):
# 		str_t = str_t.split(" (")[0]
# 		date, time = str_t.split(', ')
# 		start, end = time.split('-')
		
# 		if "-" in date:
# 			start_time = datetime.strptime(
# 				" ".join([date, start]), 
# 				"%d-%b-%Y %H:%M"
# 			)
# 			end_time = datetime.strptime(
# 				" ".join([date, end]),
# 				"%d-%b-%Y %H:%M"
# 			)
# 		else:
# 			current_year = str(datetime.now().year)
# 			start_time = datetime.strptime(
# 				" ".join([current_year, date, start]), 
# 				"%Y %a %b %d %H:%M"
# 			)
# 			end_time = datetime.strptime(
# 				" ".join([current_year, date, end]), 
# 				"%Y %a %b %d %H:%M"
# 			)
			
# 		return start_time, end_time



	
# # # TESTING
# # if __name__ == "__main__":
# # 	scraper = RSScraperRepository()
# # 	url_agora = "https://researchseminars.org/seminar/cogentseminarkkkkk"
# # 	# print(scraper.get_valid_series_and_ntalks(url_agora))

if __name__ == "__main__":
    obj = ResearchSeminarsScrapper()
    print(obj)