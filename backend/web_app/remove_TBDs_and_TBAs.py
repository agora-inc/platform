from app.databases import agora_db
from repository.TalkRepository import TalkRepository
import random


'''
    Description:
        - Problem this script fixes: when we scrapped the data, a lot of talks have "TBA", or "TBD" as title.
        - Solution: this script constructs canonical talk titles. It is run manually.
   
    NOTE: this script is now obsolete: I added this logic before the creation of any talks in scheduleTalk in TalkService.


    Author: Remy;
'''

get_all_talks_db_with_tba_or_tbd_query = f'''SELECT * FROM Talks WHERE name='' OR name='TBD' OR name='TBA';'''

# get all talks
all_talks = agora_db.run_query(get_all_talks_db_with_tba_or_tbd_query)

# get all main topics
all_subtopics_query = f'''SELECT * FROM ClassificationGraphNodes WHERE is_primitive_node = 0;'''
all_subtopics = agora_db.run_query(all_subtopics_query)

# construct dict
all_subtopic_dict = {}
for subtopic in all_subtopics:
    all_subtopic_dict[subtopic["id"]] = subtopic["field"]

for talk in all_talks:
    print(talk)
    subtopic = ""
    for topic in ["topic_1_id", "topic_2_id", "topic_3_id"]:
        topic_id = talk[topic]
        if topic_id in all_subtopic_dict.keys() and subtopic == "":
            subtopic = all_subtopic_dict[topic_id]

    substituedTbaTbds = [
        "Seminar with " + talk['talk_speaker'],
        "Talk by " + talk['talk_speaker'],
        "'" + talk['channel_name'] + "' talk with " + talk['talk_speaker'],
        "Latest advancements with " + talk['talk_speaker'],
        "Recent advancements with " + talk['talk_speaker']
    ]

    if subtopic is not "":
        new_titles = [ talk['talk_speaker'] + " on " + subtopic,
          "Topics on " + subtopic + " with " + talk['talk_speaker'],
          "Advancements in " +  subtopic,
          "Seminar on " + subtopic,
          "Talk on " + subtopic,
          subtopic + " seminar"
        ]
        substituedTbaTbds = substituedTbaTbds + new_titles
    
    new_talk_name = random.choice(substituedTbaTbds)
    print(new_talk_name)


    # Update name
    update_query = f'''UPDATE Talks SET name="{new_talk_name}" WHERE id = {talk["id"]};''';
    res = agora_db.run_query(update_query)
    print(res)
