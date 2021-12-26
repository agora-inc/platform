# Imports.
from web_app.scrapping import OLD_RSScraperRepository
from bs4 import BeautifulSoup 
import requests
import ast
from joblib import Parallel, delayed
import multiprocessing

# Create RSScraper object.
rs_scraper = OLD_RSScraperRepository.RSScraperRepository()

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
    topic_dropdown = 15
    for vals in [15,17,18,19,89,142,172]:
        if topic_a.lower() in dictionary[vals]:
            topic_dropdown = vals 
            break
        
    seminar_urls.append([f"https://researchseminars.org{href_a['href']}",topic_a, topic_dropdown])
    print(f"2/3: Updated seminar URL list: {seminar_urls}")



# Parallel(n_jobs = multiprocessing.cpu_count(), prefer="threads")(delayed(convert_seminar_to_agora)(seminar_url) for seminar_url in seminar_urls[:15])
total = len(seminar_urls)
for seminar_url in seminar_urls:
    total = total - 1
    print(f"{total} of {(len(seminar_urls))} remaining")
    rs_scraper.convert_seminar_to_agora(seminar_url)
rs_scraper.update()
