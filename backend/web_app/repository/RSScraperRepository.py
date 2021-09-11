from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
import time

# Set-up selenium
DRIVER_PATH = '/home/cloud-user/Downloads/chromedriver_linux64/chromedriver'
options = Options()
options.headless = True
options.add_argument("--window-size=1920,1200")
driver = webdriver.Chrome(options=options, executable_path=DRIVER_PATH)


# Scrap page
driver.get("https://researchseminars.org/seminar/GeomInequAndPDEs")

info = {}

# Agora name
info['name'] = driver.find_element_by_xpath("//h1").text

# Description
description = driver.find_elements_by_xpath("//p")[2:]
description = [e.text for e in description if e.text != '']
info['description'] = '\n'.join(description)

# Talks
fields = ['weekday', 'monthdate', 'time', 'speaker', 'talktitle']
talks_info = {}
for f in fields:
  talks_info[f] = [e.text for e in driver.find_elements_by_class_name(f) if e.text != '']

n_talks = len(talks_info['weekday'])
info['talks'] = [{} for _ in range(n_talks)]

for i in range(n_talks):
  print(i)
  # basic info
  for f in fields:
    info['talks'][i][f] = talks_info[f][i]
    
  # talk description
  driver.find_elements_by_class_name("talktitle")[i].click()
  try:
    e = WebDriverWait(driver, 1).until(
      EC.presence_of_element_located((By.CLASS_NAME, 'talk-details-container'))
    )
    info['talks'][i]['description'] =  e.text.split('\n')[0][10:]

  except TimeoutException:
    info['talks'][i]['description'] = "TBA"
    
  driver.refresh()

print(info)


driver.quit()