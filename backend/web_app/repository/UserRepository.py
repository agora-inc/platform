from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, username, password):
        self.username = username
        self.password = generate_password_hash(password)

class UserRepository:
    def __init__(self, db):
        self.db = db

    def getAllUsers(self):
        # cursor = self.db.con.cursor()
        # cursor.execute("SELECT * FROM Users")
        # result = cursor.fetchall()
        # cursor.close()
        query = "SELECT * FROM Users"
        result = self.db.run_query(query)
        return result

    def getUser(self, username):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Users WHERE username = "%s"' % username)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Users WHERE username = "{username}"'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def getUserById(self, id):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Users WHERE id = "%d"' % id)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Users WHERE id = {id}'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def addUser(self, username, password):
        passwordHash = generate_password_hash(password)
        # cursor = self.db.con.cursor()
        # cursor.execute('INSERT INTO Users(username, password_hash, is_live) VALUES ("%s", "%s", 0)' % (username, passwordHash))
        # self.db.con.commit()
        # cursor.close()
        query = f'INSERT INTO Users(username, password_hash, is_live) VALUES ("{username}", "{passwordHash}", 0)'
        insertId = self.db.run_query(query)[0]
        return self.getUserById(insertId)
    
    def authenticate(self, username, password):
        user = self.getUser(username)
        if user != None and check_password_hash(user["password_hash"], password):
            return user 
        else:
            return None

    # def getCurrentlyLiveUsers(self):
    #     cursor = self.db.con.cursor()
    #     cursor.execute('SELECT * FROM Users WHERE is_live = 1')
    #     result = cursor.fetchall()
    #     cursor.close()
    #     return result

    # def goLive(self, username):
    #     cursor = self.db.con.cursor()
    #     query = 'UPDATE Users SET is_live = 1 WHERE username = %s' % username
    #     cursor.execute(query)
    #     self.db.con.commit()
    #     cursor.close()

    # def stopLive(self, username):
    #     cursor = self.db.con.cursor()
    #     query = 'UPDATE Users SET is_live = 0 WHERE username = %s' % username
    #     cursor.execute(query)
    #     self.db.con.commit()
    #     cursor.close()


    