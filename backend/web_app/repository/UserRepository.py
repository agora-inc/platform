from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import jwt

class User:
    def __init__(self, username, password):
        self.username = username
        self.password = generate_password_hash(password)

class UserRepository:
    def __init__(self, db):
        self.db = db
        self.secret = b'\xccu\x9e2\xda\xe8\x16\x8a\x137\xde@G\xc7T\xf1\x16\xca\x05\xee\xa7\xa4\x98\x05'

    def getAllUsers(self):
        query = "SELECT * FROM Users"
        result = self.db.run_query(query)
        return result

    def getAllPublicUsers(self):
        query = "SELECT id, username, email, bio FROM Users WHERE public = 1"
        result = self.db.run_query(query)
        return result

    def getUser(self, username):
        query = f'SELECT * FROM Users WHERE username = "{username}"'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def getUserById(self, id):
        query = f'SELECT * FROM Users WHERE id = {id}'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def addUser(self, username, password, email):
        # check if username exists
        if self.getUser(username):
            return None

        passwordHash = generate_password_hash(password)
        query = f'INSERT INTO Users(username, password_hash, email) VALUES ("{username}", "{passwordHash}", "{email}")'
        insertId = self.db.run_query(query)[0]
        return self.getUserById(insertId)
    
    def authenticate(self, username, password):
        user = self.getUser(username)
        if user != None and check_password_hash(user["password_hash"], password):
            return user 
        else:
            return None

    def encodeAuthToken(self, userId, type):
        now = datetime.utcnow()

        if type == "refresh":
            exp = now + timedelta(days=7)
        elif type == "changePassword":
            exp = now + timedelta(minutes=15)
        else:
            exp = now + timedelta(minutes=30)

        try:
            payload = {
                'exp': exp,
                'iat': now,
                'sub': userId
            }
            return jwt.encode(
                payload,
                self.secret,
                algorithm='HS256'
            )
        except Exception as e:
            return e

    def decodeAuthToken(self, token):
        try:
            payload = jwt.decode(token, self.secret)
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

    def changePassword(self, userId, newPassword):
        passwordHash = generate_password_hash(newPassword)
        query = f'UPDATE Users SET password_hash = "{passwordHash}" WHERE id = {userId}'
        self.db.run_query(query)

    def updateBio(self, userId, newBio):
        query = f'UPDATE Users SET bio = "{newBio}" WHERE id = {userId}'
        self.db.run_query(query)
        return self.getUserById(userId)

    def updatePublic(self, userId, public):
        query = f'UPDATE Users SET public = "{int(public)}" WHERE id = {userId}'
        self.db.run_query(query)
        return self.getUserById(userId)


    


    