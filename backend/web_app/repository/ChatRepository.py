import logging

class ChatRepository():
    def __init__(self, db):
        self.db = db
        
    def setup_chat_backend(self, chat_type, channel_id=None):
        assert(chat_type in ["channel", "private", "independent"])

        if chat_type in ["private" , 'independent']:
            logging.error(f"setup_chat_backend: exception; chat_type has not been tested for 'private' and 'independent'.")

        if channel_id == None:
            channel_id = "NULL"

        try:
            cursor = self.db.con.cursor()
            # Create the main chat node + special group for bans
            cursor.execute(f'INSERT INTO Chats(name, chat_type, channel_id) values ("main_node", "channel", {channel_id})')
            self.db.con.commit()
            chat_id = cursor.lastrowid

            # 1) subscribed group
            cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "subscribed", "channel", {channel_id})')
            self.db.con.commit()
            subscribed_id = cursor.lastrowid

            # 2) blocked group
            cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "blocked", "channel", {channel_id})')
            self.db.con.commit()
            blocked_id = cursor.lastrowid
            
            if chat_type != "private":
                # 3) silenced group
                cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "silenced", "channel", {channel_id})')
                self.db.con.commit()
                silenced_id = cursor.lastrowid

                # 4) admin group
                cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "admins", "channel", {channel_id})')
                self.db.con.commit()
                admin_id = cursor.lastrowid

                # 5) community group
                cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "community_members", "channel", {channel_id})')
                self.db.con.commit()
                community_group_id = cursor.lastrowid
            
                # 6) moderators group
                cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "moderators", "channel", {channel_id})')
                self.db.con.commit()
                moderators_group_id = cursor.lastrowid
            
            else:
                silenced_id = "NULL"
                admin_id = "NULL"
                community_group_id = "NULL"
                moderators_group_id = "NULL"

            # Update Chat vals
            cursor.execute(f"UPDATE Chats set subscribers_group_id={subscribed_id}, blocked_group_id=={blocked_id}, silenced_group_id={silenced_id}, admins_group_id={admin_id}, community_group_id={community_group_id}, moderators_group_id={moderators_group_id} where id={chat_id}")
            self.db.con.commit()

            cursor.close()
        
        except Exception as e:
            logging.error(f"setup_chat_backend: exception; {e}")


    def delete_chat_backend(self, chat_id):
        # archive the data: PLACEHOLDER
        pass

        # deletion from DBs
        try:
            cursor = self.db.con.cursor()
            cursor.execute(f"DELETE FROM ChatParticipantGroups where chat_id={chat_id}")
            cursor.execute(f"DELETE FROM Chats where id={chat_id}")
            self.db.con.commit()
            cursor.close()
        except Exception as e:
            logging.error(f"delete_chat_backend: exception; {e}")
