from repository import UserRepository
from datetime import datetime
import re
from app.databases import agora_db


class Question:
    def __init__(self, id, content, username, postedAt, streamId, score, answers):
        self.id = id
        self.content = content
        self.username = username
        self.postedAt = postedAt
        self.streamId = streamId
        self.score = score
        self.answers = answers

class Answer:
    def __init__(self, id, content, username, postedAt, questionId, score):
        self.id = id
        self.content = content
        self.username = username
        self.postedAt = postedAt
        self.questionId = questionId
        self.score = score 

class QandARepository:
    def __init__(self, db=agora_db):
        self.db = db

    def getQuestionById(self, id):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Questions WHERE id = %d' % id)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Questions WHERE id = {id}'
        result = self.db.run_query(query)
        if not result:
            return None
        
        return result[0]

    def getAnswerById(self, id):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Answers WHERE id = %d' % id)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Answers WHERE id = {id}'
        result = self.db.run_query(query)
        if not result:
            return None
        
        return result[0]
    
    def createQuestion(self, userId, content, streamId=None, videoId=None):
        postedAt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # cursor = self.db.con.cursor()

        if streamId != None:
            query = f'INSERT INTO Questions(content, user_id, posted_at, stream_id, score) VALUES ("{content}", {userId}, "{postedAt}", {streamId}, 0)'
        else:
            query = f'INSERT INTO Questions(content, user_id, posted_at, video_id, score) VALUES ("{content}", {userId}, "{postedAt}", {videoId}, 0)'

        # cursor.execute(query)
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)

        if streamId != None:
            return self.getAllQuestionsForStream(streamId=streamId)
        return self.getAllQuestionsForStream(videoId=videoId)

    def answerQuestion(self, userId, questionId, content):
        postedAt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # cursor = self.db.con.cursor()
        query = f'INSERT INTO Answers(content, user_id, posted_at, question_id, score) VALUES (QUOTE("{re.escape(content)}"), {userId}, "{postedAt}", {questionId}, 0)'
        # cursor.execute('INSERT INTO Answers(content, user_id, posted_at, question_id, score) VALUES (QUOTE("%s"), %d, "%s", %d, 0)' % (re.escape(content), userId, postedAt, questionId))
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)

        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        else:
            return self.getAllQuestionsForStream(videoId=question["video_id"])

    def getAllAnswersForQuestion(self, questionId):
        users = UserRepository.UserRepository(db=self.db)

        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM Answers WHERE question_id = {questionId}'
        # cursor.execute('SELECT * FROM Answers WHERE question_id = %d' % questionId)
        # answers = cursor.fetchall()
        # cursor.close()
        answers = self.db.run_query(query)

        for answer in answers:
            answer["content"] = answer["content"][1:-1].replace('\\\\', '\\')
            answer["username"] = users.getUserById(answer["user_id"])["username"]
            answer["upvoters"] = self.getUpvotersForAnswer(answer["id"])
            answer["downvoters"] = self.getDownvotersForAnswer(answer["id"])

        return answers
          
    def getAllQuestionsForStream(self, streamId=None, videoId=None):
        users = UserRepository.UserRepository(db=self.db)
        # cursor = self.db.con.cursor()

        if streamId != None:
            query = f'SELECT * FROM Questions WHERE stream_id = {streamId}'
        else:
            query = f'SELECT * FROM Questions WHERE video_id = {videoId}'

        # cursor.execute(query)
        # questions = cursor.fetchall()
        # cursor.close()
        questions = self.db.run_query(query)

        for question in questions:
            question["answers"] = self.getAllAnswersForQuestion(question["id"])
            question["username"] = users.getUserById(question["user_id"])["username"]
            question["upvoters"] = self.getUpvotersForQuestion(question["id"])
            question["downvoters"] = self.getDownvotersForQuestion(question["id"])

        return questions

    def upvoteQuestion(self, questionId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Questions SET score = score + 1 WHERE id = {questionId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Questions SET score = score + 1 WHERE id = %d' % questionId)
        query = f'INSERT INTO Upvotes(user_id, target, question_id) VALUES ({userId}, "question", {questionId})'
        self.db.run_query(query)
        # cursor.execute('INSERT INTO Upvotes(user_id, target, question_id) VALUES (%d, "question", %d)' % (userId, questionId))
        # self.db.con.commit()
        # cursor.close()

        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def downvoteQuestion(self, questionId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Questions SET score = score - 1 WHERE id = {questionId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Questions SET score = score + 1 WHERE id = %d' % questionId)
        query = f'INSERT INTO Downvotes(user_id, target, question_id) VALUES ({userId}, "question", {questionId})'
        self.db.run_query(query)
        # cursor.execute('INSERT INTO Upvotes(user_id, target, question_id) VALUES (%d, "question", %d)' % (userId, questionId))
        # self.db.con.commit()
        # cursor.close()

        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def upvoteAnswer(self, answerId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Answers SET score = score + 1 WHERE id = {answerId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Answers SET score = score + 1 WHERE id = %d' % answerId)
        query = f'INSERT INTO Upvotes(user_id, target, answer_id) VALUES ({userId}, "answer", {answerId})'
        self.db.run_query(query)
        # cursor.execute('INSERT INTO Upvotes(user_id, target, answer_id) VALUES (%d, "answer", %d)' % (userId, answerId))
        # self.db.con.commit()
        # cursor.close()

        questionId = self.getAnswerById(answerId)["question_id"]
        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def downvoteAnswer(self, answerId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Answers SET score = score - 1 WHERE id = {answerId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Answers SET score = score + 1 WHERE id = %d' % answerId)
        query = f'INSERT INTO Downvotes(user_id, target, answer_id) VALUES ({userId}, "answer", {answerId})'
        self.db.run_query(query)
        # cursor.execute('INSERT INTO Upvotes(user_id, target, answer_id) VALUES (%d, "answer", %d)' % (userId, answerId))
        # self.db.con.commit()
        # cursor.close()

        questionId = self.getAnswerById(answerId)["question_id"]
        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def removeQuestionUpvote(self, questionId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Questions SET score = score - 1 WHERE id = {questionId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Questions SET score = score - 1 WHERE id = %d' % questionId)
        query = f'DELETE FROM Upvotes WHERE question_id = {questionId} AND user_id = {userId}'
        self.db.run_query(query)
        # cursor.execute('DELETE FROM Upvotes WHERE question_id = %d AND user_id = %d' % (questionId, userId))
        # self.db.con.commit()
        # cursor.close()

        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def removeQuestionDownvote(self, questionId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Questions SET score = score + 1 WHERE id = {questionId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Questions SET score = score - 1 WHERE id = %d' % questionId)
        query = f'DELETE FROM Downvotes WHERE question_id = {questionId} AND user_id = {userId}'
        self.db.run_query(query)
        # cursor.execute('DELETE FROM Upvotes WHERE question_id = %d AND user_id = %d' % (questionId, userId))
        # self.db.con.commit()
        # cursor.close()

        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def removeAnswerUpvote(self, answerId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Answers SET score = score - 1 WHERE id = {questionId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Questions SET score = score - 1 WHERE id = %d' % questionId)
        query = f'DELETE FROM Upvotes WHERE answer_id = {answerId} AND user_id = {userId}'
        self.db.run_query(query)
        # cursor.execute('DELETE FROM Upvotes WHERE question_id = %d AND user_id = %d' % (questionId, userId))
        # self.db.con.commit()
        # cursor.close()


        questionId = self.getAnswerById(answerId)["question_id"]
        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def removeAnswerDownvote(self, answerId, userId):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Answers SET score = score + 1 WHERE id = {questionId}'
        self.db.run_query(query)
        # cursor.execute('UPDATE Questions SET score = score - 1 WHERE id = %d' % questionId)
        query = f'DELETE FROM Downvotes WHERE answer_id = {answerId} AND user_id = {userId}'
        self.db.run_query(query)
        # cursor.execute('DELETE FROM Upvotes WHERE question_id = %d AND user_id = %d' % (questionId, userId))
        # self.db.con.commit()
        # cursor.close()

        questionId = self.getAnswerById(answerId)["question_id"]
        question = self.getQuestionById(questionId)
        if question["stream_id"]:
            return self.getAllQuestionsForStream(streamId=question["stream_id"])
        return self.getAllQuestionsForStream(videoId=question["video_id"])

    def getUpvotersForQuestion(self, questionId):
        users = UserRepository.UserRepository(db=self.db)
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM Upvotes WHERE question_id = {questionId}'
        upvoters = self.db.run_query(query)
        # cursor.execute('SELECT * FROM Upvotes WHERE question_id = %d' % questionId)
        # upvoters = cursor.fetchall()
        # cursor.close()

        return [users.getUserById(upvoter["user_id"])["username"] for upvoter in upvoters]

    def getDownvotersForQuestion(self, questionId):
        users = UserRepository.UserRepository(db=self.db)
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM Downvotes WHERE question_id = {questionId}'
        downvoters = self.db.run_query(query)
        # cursor.execute('SELECT * FROM Upvotes WHERE question_id = %d' % questionId)
        # upvoters = cursor.fetchall()
        # cursor.close()

        return [users.getUserById(downvoter["user_id"])["username"] for downvoter in downvoters]

    def getUpvotersForAnswer(self, answerId):
        users = UserRepository.UserRepository(db=self.db)
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM Upvotes WHERE answer_id = {answerId}'
        upvoters = self.db.run_query(query)
        # cursor.execute('SELECT * FROM Upvotes WHERE question_id = %d' % questionId)
        # upvoters = cursor.fetchall()
        # cursor.close()

        return [users.getUserById(upvoter["user_id"])["username"] for upvoter in upvoters]

    def getDownvotersForAnswer(self, answerId):
        users = UserRepository.UserRepository(db=self.db)
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM Downvotes WHERE answer_id = {answerId}'
        upvoters = self.db.run_query(query)
        # cursor.execute('SELECT * FROM Upvotes WHERE question_id = %d' % questionId)
        # upvoters = cursor.fetchall()
        # cursor.close()

        return [users.getUserById(upvoter["user_id"])["username"] for upvoter in upvoters]