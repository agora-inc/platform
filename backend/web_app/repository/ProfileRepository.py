import os
from app.databases import agora_db
from repository.TopicRepository import TopicRepository


class ProfileRepository:
    def __init__(self, db=agora_db):
        self.db = db
        self.topics = TopicRepository(db=self.db)

    def getProfile(self, user_id):
        query_user = f"SELECT id, username, email, bio, institution, position, verified_academic, personal_homepage FROM Users WHERE id = {user_id};"
        user = self.db.run_query(query_user)[0]
        # profile
        query_profile = f"SELECT full_name, has_photo, open_give_talk, twitter_handle FROM Profiles WHERE user_id = {user_id};"
        profile = self.db.run_query(query_profile)[0]
        # topics
        query_topics = f"SELECT topic_1_id, topic_2_id, topic_3_id FROM Profiles WHERE user_id = {user_id};"
        topics = self.db.run_query(query_topics)[0]
        # papers
        query_papers = f"SELECT id, title, authors, publisher, year, link FROM ProfilePapers WHERE user_id = {user_id};"
        papers = self.db.run_query(query_papers)
        # tags
        query_tags = f"SELECT tag FROM ProfileTags WHERE user_id = {user_id};"
        tags = self.db.run_query(query_tags)

        # package everything in a dict
        res = {'user': user, 'papers': papers, 'tags': [], 'topics': [], 'has_photo': 0, 'open_give_talk': 1}
        res.update(profile)

        for topic_id in topics.values():
            if topic_id:
                res['topics'].append(self.topics.getTopicFromId(topic_id))

        for tag in tags:
            res['tags'].append(tag['tag'])

        return res

    def getAllPublicProfiles(self):
        query_public_user = "SELECT id, username, email, bio, institution, position, verified_academic, personal_homepage FROM Users WHERE public = 1;"
        users = self.db.run_query(query_public_user)
        # all ids of public users
        ids = [user['id'] for user in users]
        tuple_ids = ProfileRepository.list_to_tuple(ids)
        # all profiles of public users
        query_profiles = f"SELECT user_id, full_name, has_photo, open_give_talk, twitter_handle FROM Profiles WHERE user_id in {tuple_ids};"
        profiles = self.db.run_query(query_profiles)
        # all topics of public users
        query_topics = f"SELECT user_id, topic_1_id, topic_2_id, topic_3_id FROM Profiles WHERE user_id in {tuple_ids};"
        topics = self.db.run_query(query_topics)
        # all papers of public users
        query_papers = f"SELECT user_id, id, title, authors, publisher, year, link FROM ProfilePapers WHERE user_id in {tuple_ids};"
        papers = self.db.run_query(query_papers)
        # all tags of public users
        query_tags = f"SELECT user_id, tag FROM ProfileTags WHERE user_id in {tuple_ids};"
        tags = self.db.run_query(query_tags)

        # package everything in a dictionary
        result = {}
        for user in users:
            result[user['id']] = {'user': user, 'papers': [], 'tags': [], 'topics': [], 'has_photo': 0, 'open_give_talk': 1}

        for profile in profiles:
            user_id = profile.pop('user_id', None)
            if user_id in ids:
                result[user_id].update(profile)

        for topic in topics:
            user_id = topic.pop('user_id', None)
            if user_id in ids:
                for topic_id in topic.values():
                    if topic_id:
                        result[user_id]['topics'].append(self.topics.getTopicFromId(topic_id))

        for paper in papers:
            user_id = paper.pop('user_id', None)
            if user_id in ids:
                result[user_id]['papers'].append(paper)

        for tag in tags:
            if user_id in ids:
                result[tag['user_id']]['tags'].append(tag['tag'])

        return list(result.values())

    def getAllPublicProfilesByTopicRecursive(self, topic_id):
        pass

    def updatePaper(self, user_id, paper):
        if int(paper['id']) > 0:
            update_query = f'''UPDATE ProfilePapers SET
                user_id={user_id},
                title="{paper['title']}",
                authors="{paper['authors']}",
                publisher="{paper['publisher']}",
                year="{paper['year']}",
                link="{paper['link']}"
            WHERE id={paper['id']}; '''

            self.db.run_query(update_query)
            return int(paper['id'])
            
        else:
            insert_query = f'''INSERT INTO ProfilePapers (
                user_id, title, authors, publisher, year, link
            ) VALUES (
                {user_id}, "{paper['title']}", "{paper['authors']}",
                "{paper['publisher']}", "{paper['year']}", "{paper['link']}"
            ); '''

            return int(self.db.run_query(insert_query)[0])

    def deletePaper(self, paper_id):
        query = f'DELETE FROM ProfilePapers where id = {paper_id}'
        self.db.run_query(query)

    def addProfilePhoto(self, userId):
        query = f'UPDATE Profiles SET has_photo=1 WHERE user_id = {userId}'
        self.db.run_query(query)

    def removeProfilePhoto(self, userId):
        query = f'UPDATE Profiles SET has_photo=0 WHERE user_id = {userId}'
        self.db.run_query(query)

    def getProfilePhotoLocation(self, userId):
        query = f'SELECT has_photo FROM Profiles WHERE user_id = {userId}'
        res = self.db.run_query(query)

        if res[0]["has_photo"] == 1:
            return f"/home/cloud-user/plateform/agora/storage/images/profiles/{userId}.jpg"
        else:
            return None

    def updateTags(self, user_id, tags):
        delete_query = f"DELETE FROM ProfileTags where user_id = {user_id};"
        self.db.run_query(delete_query)
        add_query = "INSERT INTO ProfileTags (user_id, tag) VALUES " + ', '.join([f'({user_id}, "{tag}")' for tag in tags]) + ";"
        self.db.run_query(add_query)

    @staticmethod
    def list_to_tuple(lst):
        if len(lst) == 1:
            return "('" + str(lst[0]) + "')"
        else:
            return str(tuple(lst))