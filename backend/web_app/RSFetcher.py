# Import RSScraper
from app.routes import RSScraperRepository

from bs4 import BeautifulSoup 
import requests
import ast
URL = 'https://researchseminars.org/seminar_series'
content = requests.get(URL)
soup = BeautifulSoup(content.text, 'html.parser')

# Dictionary for primitive node classification 
file = open("primitive_topics.txt")
contents = file.read()
dictionary = ast.literal_eval(contents)
file.close()

rows = soup.findAll("tr", {"class" : "talk"})
seminar_urls = []
for row in rows:
    href_a = row.find("td", {"class" : "seriesname"}).find("a")
    topic_a = row.find("td", {"class" : "topics"}).find("span", {"class" : "topic_label"}).text
    # get primitive topic for tag, works most of the time  
    for vals in [15,17,18,19,89,142,172]:
        if topic_a.lower() in dictionary[vals]:
            topic_dropdown = vals 
            break
        

    seminar_urls.append([f"https://researchseminars.org{href_a['href']}",topic_a, topic_dropdown])

for seminar_url in seminar_urls:
    print(seminar_url)

