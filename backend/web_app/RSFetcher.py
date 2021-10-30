# Imports.
from app.routes import RSScraperRepository
from bs4 import BeautifulSoup 
import requests
import ast
from joblib import Parallel, delayed
import multiprocessing

# Create RSScraper object.
rs_scraper = RSScraperRepository.RSScraperRepository()

# Load dictionary for primitive node classification. 
print("1/3: Fetching classification dictionary.")
file = open("primitive_topics.txt")
contents = file.read()
dictionary = ast.literal_eval(contents)
file.close()

# GET seminar url, and use bs4 to obtain topic tags.
URL = 'https://researchseminars.org/seminar_series'
content = requests.get(URL)
soup = BeautifulSoup(content.text, 'html.parser')
rows = soup.findAll("tr", {"class" : "talk"})
seminar_urls = []
print("2/3: scraping researchseminars.org for semianr series .")
for row in rows:
    href_a = row.find("td", {"class" : "seriesname"}).find("a")
    topic_a = row.find("td", {"class" : "topics"}).find("span", {"class" : "topic_label"}).text
    # Get primitive topic for tag, works most of the time.  
    for vals in [15,17,18,19,89,142,172]:
        if topic_a.lower() in dictionary[vals]:
            topic_dropdown = vals 
            break
        
    seminar_urls.append([f"https://researchseminars.org{href_a['href']}",topic_a, topic_dropdown])
    print(f"2/3: Updated seminar URL list: {seminar_urls}")

def convert_seminar_to_agora(seminar_url):
    try:
        print(seminar_url)
        is_valid, talk_ids, channel_id, channel_name, link = rs_scraper.create_agora_and_get_talk_ids(seminar_url[0], 360, seminar_url[2])    
        if(len(talk_ids) and is_valid):
            talks = rs_scraper.parse_create_talks(seminar_url[0],talk_ids,channel_id,channel_name,link,seminar_url[2],'PhD+','Everybody','Everybody')
    except (AttributeError, TypeError, IndexError) as e:
        print("For some reason no talks were parsed!")

# Parallel(n_jobs = multiprocessing.cpu_count(), prefer="threads")(delayed(convert_seminar_to_agora)(seminar_url) for seminar_url in seminar_urls[:15])
print("3/3: converting seminars into agoras ")
for seminar_url in seminar_urls[:15]:
    try:
        convert_seminar_to_agora(seminar_url)
        print(f"3/3: converted seminars into agoras; {seminar_url}")
    except Exception as e:
        print(f"3/3: ERROR for {seminar_url}: {e} ")
        pass
