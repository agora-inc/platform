import pymysql
import logging
import sys

class SqlDatabase:
    def __init__(self):
        self.host = "apollo-2.c91ghtqneybi.eu-west-2.rds.amazonaws.com"
        self.user = "admin"
        self.password = "123.qwe.asd"
        self.db = "apollo"
        self.con = pymysql.connect(host=self.host, user=self.user, password=self.password, db=self.db, cursorclass=pymysql.cursors.
                                DictCursor)
        
    def open_connection(self):
        """Connect to MySQL Database."""
        try:
            if self.con is None:
                self.con = pymysql.connect(host=self.host, user=self.user, password=self.password, db=self.db, cursorclass=pymysql.cursors.DictCursor)
        
        except pymysql.MySQLError as e:
            logging.error(e)
            sys.exit()
        finally:
            logging.info('Connection opened successfully.')

    def run_query(self, query):
        """Execute SQL query."""
        def _single_query(query):
            try:
                self.open_connection()
                with self.con.cursor() as cur:
                    if 'SELECT' in query or 'select' in query:
                        records = []
                        cur.execute(query)
                        result = cur.fetchall()
                        for row in result:
                            records.append(row)
                        cur.close()
                        return records
                    else:
                        result = cur.execute(query)
                        self.con.commit()
                        insertId = cur.lastrowid
                        rowCount = cur.rowcount
                        cur.close()
                        return [insertId, rowCount]
            except pymysql.MySQLError as e:
                logging.warning(f"(Database):run_query: exception: {e}")
            finally:
                if self.con:
                    self.con.close()
                    self.con = None
                    logging.info('Database connection closed.')

        if isinstance(query, str):
            return _single_query(query)
        elif isinstance(query, list):
            responses = []
            for q in query:
                if isinstance(q, str):
                    responses.append(_single_query(q))
                else:
                    raise TypeError("run_query: each element of the list must be a string.")
            return responses
        elif isinstance(query, None):
            pass
        else:
            raise TypeError("run_query: query must be a SQL request string or a list of SQL request strings.")

agora_db = SqlDatabase()