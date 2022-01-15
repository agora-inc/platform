import os
from app.databases import agora_db
from repository.UserRepository import UserRepository
from repository.TopicRepository import TopicRepository


class ProfileRepository:
    def __init__(self, db=agora_db):
        self.db = db
        self.users = UserRepository(db=self.db)
        self.topics = TopicRepository(db=self.db)

    def getProfile(self, user_id):
        query_user = f"SELECT id, username, email, bio, institution, position, verified_academic, personal_homepage FROM Users WHERE id = {user_id};"
        user = self.db.run_query(query_user)[0]
        # profile
        query_profile = f"SELECT full_name, has_photo, open_give_talk, twitter_handle, google_scholar_link FROM Profiles WHERE user_id = {user_id};"
        profile = self.db.run_query(query_profile)[0]
        # topics
        query_topics = f"SELECT topic_1_id, topic_2_id, topic_3_id FROM Profiles WHERE user_id = {user_id};"
        topics = self.db.run_query(query_topics)[0]
        # papers
        query_papers = f"SELECT id, title, authors, publisher, year, link FROM ProfilePapers WHERE user_id = {user_id};"
        papers = self.db.run_query(query_papers)
        # presentations
        query_presentations = f"SELECT id, user_id, title, description, link, duration, open FROM Presentations WHERE user_id = {user_id};"
        presentations = self.db.run_query(query_presentations)
        # tags
        query_tags = f"SELECT tag FROM ProfileTags WHERE user_id = {user_id};"
        tags = self.db.run_query(query_tags)

        # package everything in a dict
        res = {'user': user, 'papers': papers, 'presentations': presentations, 'tags': [], 'topics': [], 'has_photo': 0, 'open_give_talk': 1}
        res.update(profile)

        for topic_id in topics.values():
            if topic_id:
                res['topics'].append(self.topics.getTopicFromId(topic_id))

        for tag in tags:
            res['tags'].append(tag['tag'])

        return res

    def getAllPublicProfiles(self, limit, offset):
        query_public_user = "SELECT id, username, email, bio, institution, position, verified_academic, personal_homepage " + \
            f"FROM Users WHERE public = 1 LIMIT {limit} OFFSET {offset};"
        users = self.db.run_query(query_public_user)
        # all ids of public users
        ids = [user['id'] for user in users]
        tuple_ids = ProfileRepository.list_to_tuple(ids)
        # all profiles of public users
        query_profiles = f"SELECT user_id, full_name, has_photo, open_give_talk, twitter_handle, google_scholar_link FROM Profiles WHERE user_id in {tuple_ids};"
        profiles = self.db.run_query(query_profiles)
        # all topics of public users
        query_topics = f"SELECT user_id, topic_1_id, topic_2_id, topic_3_id FROM Profiles WHERE user_id in {tuple_ids};"
        topics = self.db.run_query(query_topics)
        # all papers of public users
        query_papers = f"SELECT user_id, id, title, authors, publisher, year, link FROM ProfilePapers WHERE user_id in {tuple_ids};"
        papers = self.db.run_query(query_papers)
        # all presentations of public users
        query_presentations = f"SELECT id, user_id, title, description, link, duration, open FROM Presentations WHERE user_id in {tuple_ids};"
        presentations = self.db.run_query(query_presentations)
        # all tags of public users
        query_tags = f"SELECT user_id, tag FROM ProfileTags WHERE user_id in {tuple_ids};"
        tags = self.db.run_query(query_tags)

        return self._queries_to_dict(ids, users, profiles, topics, papers, presentations, tags)

    def getAllPublicProfilesByTopicRecursive(self, topic_id, limit, offset):
        children_topic_ids = str(tuple(self.topics.getAllChildrenIdRecursive(topic_id)))
        # get userId from topics 
        query_user_ids = f"SELECT user_id FROM Profiles WHERE " + \
            f"(topic_1_id in {children_topic_ids} OR topic_2_id in {children_topic_ids} OR topic_3_id in {children_topic_ids}) LIMIT {limit} OFFSET {offset};"
        user_topics_ids = self.db.run_query(query_user_ids)
        user_topics_ids = tuple([e['user_id'] for e in user_topics_ids])
        # get public users
        query_public_user = "SELECT id, username, email, bio, institution, position, verified_academic, personal_homepage " + \
            f"FROM Users WHERE id in {user_topics_ids} AND public = 1 LIMIT {limit} OFFSET {offset};"
        users = self.db.run_query(query_public_user)
        # all ids of public users + selected topics
        ids = [user['id'] for user in users]
        tuple_ids = ProfileRepository.list_to_tuple(ids)
        # all profiles of public users + selected topics
        query_profiles = f"SELECT user_id, full_name, has_photo, open_give_talk, twitter_handle, google_scholar_link FROM Profiles WHERE user_id in {tuple_ids};"
        profiles = self.db.run_query(query_profiles)
        # all topics of public users + selected topics
        query_topics = f"SELECT user_id, topic_1_id, topic_2_id, topic_3_id FROM Profiles WHERE user_id in {tuple_ids};"
        topics = self.db.run_query(query_topics)
        # all papers of public users + selected topics
        query_papers = f"SELECT user_id, id, title, authors, publisher, year, link FROM ProfilePapers WHERE user_id in {tuple_ids};"
        papers = self.db.run_query(query_papers)
        # all presentations of public users + selected topics
        query_presentations = f"SELECT id, user_id, title, description, link, duration, open FROM Presentations WHERE user_id in {tuple_ids};"
        presentations = self.db.run_query(query_presentations)
        # all tags of public users + selected topics
        query_tags = f"SELECT user_id, tag FROM ProfileTags WHERE user_id in {tuple_ids};"
        tags = self.db.run_query(query_tags)

        return self._queries_to_dict(ids, users, profiles, topics, papers, presentations, tags)

    def updateBio(self, user_id, bio):
        update_query = f'''UPDATE Users SET bio="{bio}" WHERE id={user_id};'''
        self.db.run_query(update_query)

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
    
    def updatePresentation(self, user_id, presentation):
        if int(presentation['id']) > 0:
            update_query = f'''UPDATE Presentations SET
                user_id={user_id},
                title="{presentation['title']}",
                description="{presentation['description']}",
                link="{presentation['link']}",
                duration={presentation['duration']},
                open={presentation['open']}
            WHERE id={presentation['id']}; '''

            self.db.run_query(update_query)
            return int(presentation['id'])
            
        else:
            insert_query = f'''INSERT INTO Presentations (
                user_id, title, description, link, duration, open
            ) VALUES (
                {user_id}, "{presentation['title']}", "{presentation['description']}",
                "{presentation['link']}", {presentation['duration']}, {presentation['open']}
            ); '''

            return int(self.db.run_query(insert_query)[0])

    def deletePaper(self, paper_id):
        query = f'DELETE FROM ProfilePapers where id = {paper_id}'
        self.db.run_query(query)

    def deletePresentation(self, presentation_id):
        query = f'DELETE FROM Presentations where id = {presentation_id}'
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

    def updateDetails(self, user_id, dbKey, value):
        if dbKey in ["full_name", "twitter_handle", "google_scholar_link"]:
            query = f'UPDATE Profiles SET {dbKey}="{value}" WHERE user_id = {user_id};'
            self.db.run_query(query)
        elif dbKey in ["position", "institution"]:
            query = f'UPDATE Users SET {dbKey}="{value}" WHERE id = {user_id};'
            self.db.run_query(query)
        elif dbKey == "username":
            user = self.users.getUser(value)
            if user and user['id'] != user_id:
                return f"Username '{value}' already exists", 400
            else:
                query = f'UPDATE Users SET {dbKey}="{value}" WHERE id = {user_id};'
                self.db.run_query(query)
        elif dbKey == "email":
            user = self.users.getUserByEmail(value)
            if user and user['id'] != user_id:
                return f"Email address '{value}' already registered with another account", 400
            else:
                query = f'UPDATE Users SET {dbKey}="{value}" WHERE id = {user_id};'
                self.db.run_query(query)
        else:
            return "Invalid key", 400

        return "ok", 200

    def updateTags(self, user_id, tags):
        delete_query = f"DELETE FROM ProfileTags where user_id = {user_id};"
        self.db.run_query(delete_query)
        add_query = "INSERT INTO ProfileTags (user_id, tag) VALUES " + ', '.join([f'({user_id}, "{tag}")' for tag in tags]) + ";"
        self.db.run_query(add_query)

    def _queries_to_dict(self, ids, users, profiles, topics, papers, presentations, tags):
        result = {}
        for user in users:
            result[user['id']] = {'user': user, 'papers': [], 'presentations': [], 'tags': [], 'topics': [], 'has_photo': 0, 'open_give_talk': 1}

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

        for presentation in presentations:
            user_id = presentation['user_id']
            if user_id in ids:
                result[user_id]['presentations'].append(presentation)

        for tag in tags:
            user_id = tag['user_id']
            if user_id in ids:
                result[user_id]['tags'].append(tag['tag'])

        return list(result.values())

    @staticmethod
    def list_to_tuple(lst):
        if len(lst) == 1:
            return "('" + str(lst[0]) + "')"
        else:
            return str(tuple(lst))