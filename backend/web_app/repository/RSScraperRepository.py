from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
from datetime import datetime

# Set-up selenium
DRIVER_PATH = '/home/cloud-user/Downloads/chromedriver_linux64/chromedriver'
options = Options()
options.headless = True
options.add_argument("--window-size=1920,1200")
driver = webdriver.Chrome(options=options, executable_path=DRIVER_PATH)


USERNAME = "revolutionisingresearch@gmail.com"
PASSWORD = "234.wer.sdf"

# Log in 
"""
driver.get("https://researchseminars.org/user/info")
login = driver.find_element_by_name("email").send_keys(USERNAME)
password = driver.find_element_by_name("password").send_keys(PASSWORD)
submit = driver.find_element_by_name("submit").click()
try:
  logout_button = driver.find_element_by_class_name("side-cancel")
  print('Successfully logged in')
except NoSuchElementException:
  print('Incorrect login/password')
"""


# Scrap page
url_agora = "https://researchseminars.org/seminar/cogentseminar"
# "https://researchseminars.org/seminar/GeomInequAndPDEs"
driver.get(url_agora)

info = {}

# Agora name
info['name'] = driver.find_element_by_xpath("//h1").text

# Description
description = driver.find_elements_by_xpath("//p")[2:]
description = [e.text for e in description if e.text != '']
info['description'] = '\n'.join(description)

# Talks
url_talks = url_agora.replace("/seminar/", "/talk/")
info['talks'] = []


def get_href(lst_link, txt):
  elements = [e for e in lst_link if e.text == txt]
  if len(elements) > 0:
    return elements[0].get_attribute('href')
  else:
    return ""

def parse_time(str_t):
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


# url_talks = "https://researchseminars.org/talk/NYC-NCG"
i = 1
driver.get(url_talks + f"/{i}")
while driver.find_element_by_id("title").text != "Page not found":
  talk = {}
  lst_link = driver.find_elements_by_xpath('//a')

  # Title
  talk['title'] = driver.find_element_by_xpath("//h1").text

  # Speaker 
  talk['speaker'] = driver.find_element_by_class_name("talk-title").text

  # Time
  str_time = driver.find_element_by_xpath('//b').text
  talk['start_time'], talk['end_time'] = parse_time(str_time)

  # Description
  e = driver.find_element_by_class_name('talk-details-container')
  lst = e.text.split('\n')
  idx = [n for n, txt in enumerate(lst) if txt[:10] == "Audience: "][0]
  talk['description'] = '\n'.join(lst[:idx]).replace('Abstract: ', '')

  # Link
  talk['link'] = get_href(lst_link, "available")

  # Slides and video
  talk['slides'] = get_href(lst_link, "slides")
  talk['video'] = get_href(lst_link, "video")

  print(talk)
  i += 1
  driver.get(url_talks + f"/{i}")















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
  


print(info)

# Logout


driver.quit()