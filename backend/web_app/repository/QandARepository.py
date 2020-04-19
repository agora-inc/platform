from repository import UserRepository
from datetime import datetime
import re

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
    def __init__(self, db):
        self.db = db

    def getQuestionById(self, id):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Questions WHERE id = %d' % id)
        result = cursor.fetchall()
        cursor.close()

        if not result:
            return None
        
        return result[0]

    def getAnswerById(self, id):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Answers WHERE id = %d' % id)
        result = cursor.fetchall()
        cursor.close()

        if not result:
            return None
        
        return result[0]
    
    def createQuestion(self, userId, content, streamId=None, videoId=None):
        postedAt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor = self.db.con.cursor()

        if streamId != None:
            query = 'INSERT INTO Questions(content, user_id, posted_at, stream_id, score) VALUES ("%s", %d, "%s", %d, 0)' % (content, userId, postedAt, streamId)
        else:
            query = 'INSERT INTO Questions(content, user_id, posted_at, video_id, score) VALUES ("%s", %d, "%s", %d, 0)' % (content, userId, postedAt, videoId)

        cursor.execute(query)
        self.db.con.commit()
        cursor.close()

        if streamId != None:
            return self.getAllQuestionsForStream(streamId=streamId)
        return self.getAllQuestionsForStream(videoId=videoId)

    def answerQuestion(self, userId, questionId, content):
        postedAt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO Answers(content, user_id, posted_at, question_id, score) VALUES (QUOTE("%s"), %d, "%s", %d, 0)' % (re.escape(content), userId, postedAt, questionId))
        self.db.con.commit()
        cursor.close()

        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def getAllAnswersForQuestion(self, questionId):
        users = UserRepository.UserRepository(db=self.db)

        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Answers WHERE question_id = %d' % questionId)
        answers = cursor.fetchall()
        cursor.close()

        for answer in answers:
            answer["content"] = answer["content"][1:-1].replace('\\\\', '\\')
            answer["username"] = users.getUserById(answer["user_id"])["username"]
            answer["upvoters"] = self.getUpvotersForAnswer(answer["id"])
            answer["downvoters"] = self.getDownvotersForAnswer(answer["id"])

        return answers
          
    def getAllQuestionsForStream(self, streamId=None, videoId=None):
        users = UserRepository.UserRepository(db=self.db)
        cursor = self.db.con.cursor()

        if streamId != None:
            query = 'SELECT * FROM Questions WHERE stream_id = %d' % streamId
        else:
            query = 'SELECT * FROM Questions WHERE video_id = %d' % videoId

        cursor.execute(query)
        questions = cursor.fetchall()
        cursor.close()

        for question in questions:
            question["answers"] = self.getAllAnswersForQuestion(question["id"])
            question["username"] = users.getUserById(question["user_id"])["username"]
            question["upvoters"] = self.getUpvotersForQuestion(question["id"])
            question["downvoters"] = self.getDownvotersForQuestion(question["id"])

        return questions

    def upvoteQuestion(self, questionId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Questions SET score = score + 1 WHERE id = %d' % questionId)
        cursor.execute('INSERT INTO Upvotes(user_id, target, question_id) VALUES (%d, "question", %d)' % (userId, questionId))
        self.db.con.commit()
        cursor.close()

        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def downvoteQuestion(self, questionId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Questions SET score = score - 1 WHERE id = %d' % questionId)
        cursor.execute('INSERT INTO Downvotes(user_id, target, question_id) VALUES (%d, "question", %d)' % (userId, questionId))
        self.db.con.commit()
        cursor.close()

        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def upvoteAnswer(self, answerId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Answers SET score = score + 1 WHERE id = %d' % answerId)
        cursor.execute('INSERT INTO Upvotes(user_id, target, answer_id) VALUES (%d, "answer", %d)' % (userId, answerId))
        self.db.con.commit()
        cursor.close()

        questionId = self.getAnswerById(answerId)["question_id"]
        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def downvoteAnswer(self, answerId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Answers SET score = score - 1 WHERE id = %d' % answerId)
        cursor.execute('INSERT INTO Downvotes(user_id, target, answer_id) VALUES (%d, "answer", %d)' % (userId, answerId))
        self.db.con.commit()
        cursor.close()

        questionId = self.getAnswerById(answerId)["question_id"]
        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def removeQuestionUpvote(self, questionId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Questions SET score = score - 1 WHERE id = %d' % questionId)
        cursor.execute('DELETE FROM Upvotes WHERE question_id = %d AND user_id = %d' % (questionId, userId))
        self.db.con.commit()
        cursor.close()

        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def removeQuestionDownvote(self, questionId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Questions SET score = score + 1 WHERE id = %d' % questionId)
        cursor.execute('DELETE FROM Downvotes WHERE question_id = %d AND user_id = %d' % (questionId, userId))
        self.db.con.commit()
        cursor.close()

        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def removeAnswerUpvote(self, answerId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Answers SET score = score - 1 WHERE id = %d' % answerId)
        cursor.execute('DELETE FROM Upvotes WHERE answer_id = %d AND user_id = %d' % (answerId, userId))
        self.db.con.commit()
        cursor.close()

        questionId = self.getAnswerById(answerId)["question_id"]
        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def removeAnswerDownvote(self, answerId, userId):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Answers SET score = score + 1 WHERE id = %d' % answerId)
        cursor.execute('DELETE FROM Downvotes WHERE answer_id = %d AND user_id = %d' % (answerId, userId))
        self.db.con.commit()
        cursor.close()

        questionId = self.getAnswerById(answerId)["question_id"]
        streamId = self.getQuestionById(questionId)["stream_id"]
        return self.getAllQuestionsForStream(streamId)

    def getUpvotersForQuestion(self, questionId):
        users = UserRepository.UserRepository(db=self.db)

        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Upvotes WHERE question_id = %d' % questionId)
        upvoters = cursor.fetchall()
        cursor.close()

        return [users.getUserById(upvoter["user_id"])["username"] for upvoter in upvoters]

    def getDownvotersForQuestion(self, questionId):
        users = UserRepository.UserRepository(db=self.db)

        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Downvotes WHERE question_id = %d' % questionId)
        downvoters = cursor.fetchall()
        cursor.close()

        return [users.getUserById(downvoter["user_id"])["username"] for downvoter in downvoters]

    def getUpvotersForAnswer(self, questionId):
        users = UserRepository.UserRepository(db=self.db)

        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Upvotes WHERE answer_id = %d' % questionId)
        upvoters = cursor.fetchall()
        cursor.close()

        return [users.getUserById(upvoter["user_id"])["username"] for upvoter in upvoters]

    def getDownvotersForAnswer(self, questionId):
        users = UserRepository.UserRepository(db=self.db)

        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Downvotes WHERE answer_id = %d' % questionId)
        downvoters = cursor.fetchall()
        cursor.close()

        return [users.getUserById(downvoter["user_id"])["username"] for downvoter in downvoters]