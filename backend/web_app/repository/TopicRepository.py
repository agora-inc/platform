import logging
from app.databases import agora_db


class TopicRepository:
    """Manages graph classification of topics in the following MYSQL table:
        -ClassificationGraphNodes: complete list of nodes
    """
    def __init__(self, db=agora_db):
        self.db = db

    def getFieldFromId(self, topicId):
        query = f'SELECT field FROM ClassificationGraphNodes WHERE id = {topicId}'
        result = self.db.run_query(query)
        return result

    def _addPrimitiveNode(self, field):
        """Method to add a primitive node, i.e. node which do not have parents
         (e.g. Mathematics, Biology)

        Args:
            field (str): name of the node
        """
        insert_query = f"INSERT INTO ClassificationGraphNodes(field, is_primitive_node) VALUES ('{field}', 1)"
        try:
            self.db.run_query(insert_query)
        except Exception as e:
            logging.warning(f"_addPrimitiveNode: exception raised: {e}")

    def _addChildNode(self, name_child, parent_name_1, parent_name_2=None, parent_name_3=None):
        """Method to add a child node with maximum 3 parents.

        Args:
            name_child (str): name of the child
            parent_name_1 (str): name of the parent 1
            parent_name_2 (str, optional): name of the parent 2. Defaults to None.
            parent_name_3 (str, optional): name of the parent 3. Defaults to None.

        Raises:
            Exception: when parents do not exist
        """
        # check name_child not taken
        existence_query = f"SELECT * FROM ClassificationGraphNodes WHERE field='{name_child}'"
        res = self.db.run_query(existence_query)

        if len(res) != 0:
            raise Exception("_addChildNode: name of the field already taken.")

        expected_len = 0
        if parent_name_2 == None:
            query = f"SELECT * FROM ClassificationGraphNodes WHERE field='{parent_name_1}'"
            expected_len = 1
        elif parent_name_2 != None and parent_name_3 == None:
            query = f"SELECT * FROM ClassificationGraphNodes WHERE field = '{parent_name_1}' OR field = '{parent_name_2}'"
            expected_len = 2
        elif parent_name_2 != None and parent_name_3 != None:
            query = f"SELECT * FROM ClassificationGraphNodes WHERE field = '{parent_name_1}' OR field = '{parent_name_2}' OR field = '{parent_name_3}'"
            expected_len = 3

        parent_results = self.db.run_query(query)

        if parent_results is None or len(parent_results) != expected_len:
            raise Exception("_addChildNode: one of the parents is not in the database or duplicated detected.")
        else:
            parent_1_id = parent_results[0]["id"]
            if expected_len == 1:
                insert_query = f"INSERT INTO ClassificationGraphNodes(field, parent_1_id) VALUES ('{name_child}', {parent_1_id})"
            elif expected_len == 2:
                parent_2_id = parent_results[1]["id"]
                insert_query = f"INSERT INTO ClassificationGraphNodes(field, parent_1_id, parent_2_id) VALUES ('{name_child}', {parent_1_id}, {parent_2_id})"
            elif expected_len == 3:
                parent_2_id = parent_results[1]["id"]
                parent_3_id = parent_results[2]["id"]
                insert_query = f"INSERT INTO ClassificationGraphNodes(field, parent_1_id, parent_2_id, parent_3_id) VALUES ('{name_child}', {parent_1_id}, {parent_2_id}, {parent_3_id})"
            try:
                self.db.run_query(insert_query)
                logging.warning("_addChildNode; successfull addition.")
            except Exception as e:
                logging.warning(f"_addChildNode: exception raised: {e}")

    def _removeNode(self, field_name=None, node_id=None):
        raise NotImplementedError("_removeNode: to be implemented once talks have been linked.")

        # if field_name == None and node_id == None:
        #     logging.warning("_removeNode: specify at least one none None field_name or node_id.")

        # elif node_id == None and field_name != None:
        #     query_id = f"SELECT * FROM ClassificationGraphNodes where field='{field_name}'" 
        #     node_id = self.db.run_query(query_id)

    def _mergeNode(self, start_node_id, destination_node_id):
        """Method merging two nodes in the DB.

        Args:
            start_node_id (int): SQL id of the start node
            destination_node_id (int): SQL id of the destination node
        """
        max_number_of_parents = 3

        try:
            # check existence of two ids
            existence_query_1 = f"SELECT * from ClassificationGraphNodes WHERE id={start_node_id}"
            existence_query_2 = f"SELECT * from ClassificationGraphNodes WHERE id={destination_node_id}"

            res = self.db.run_query([existence_query_1, existence_query_2])
            if isinstance(res, list):
                for sql_res in res:
                    if len(sql_res) != 1:
                        raise Exception(f"_mergeNode: queried an inexisting node or a duplicate node, start_node_id={start_node_id}, destination_node_id={destination_node_id}.")
            else:
                raise Exception(f"_mergeNode: wrong format of response from data base (received: {res}).")
            
            # check that sum of different parents is not bigger than 3 
            # (HARD CODED LIMIT: a node can have a maximum of 3 parents.)
            parent_sql_keys = ["parent_1_id", "parent_2_id", "parent_3_id"]
            all_parents = set([])
            for sql_res in res:
                sql_dict = sql_res[0]
                for parent_key in parent_sql_keys:
                    id_parent = sql_dict[parent_key]
                    if id_parent != None:
                        all_parents.add(id_parent)

            if len(all_parents) > max_number_of_parents:
                raise Exception(f"_mergeNode: the total number of parents of destination node will exceed the hard limit of {max_number_of_parents}. Unable to proceed unless some parents are removed.")

            # B. Update the parents of destination node
            if start_node_id in all_parents:
                all_parents.remove(start_node_id)
            if destination_node_id in all_parents:
                all_parents.remove(destination_node_id)
            all_parents_id_of_merged_node = list(all_parents)
            n_parents = len(all_parents_id_of_merged_node)
            update_to_id_parents = all_parents_id_of_merged_node

            for _ in range(n_parents-3):
                update_to_id_parents.append("NULL")

            update_destination_parent_query = f"UPDATE ClassificationGraphNodes SET parent_1_id={update_to_id_parents[0]}, parent_2_id={update_to_id_parents[1]}, parent_3_id={update_to_id_parents[2]} WHERE id={destination_node_id}"
            res = self.db.run_query(update_destination_parent_query)

            # C. Update the parent id of the childs of the start node that 
            # is being merged
            get_child_parent_need_change_query = f"SELECT * from ClassificationGraphNodes WHERE parent_1_id={start_node_id} or parent_2_id={start_node_id} or parent_3_id={start_node_id}"
            res = self.db.run_query(get_child_parent_need_change_query)

            def generate_query_for_child_node(start_id, destination_id, sql_node_dict):
                """generate the string SQL query that will modify the instances 
                of the id of the start node into the destination one for a 
                given child of the start node that is going to be merged.

                Args:
                    start_id (int): id of the start node to be merged
                    new_id (int): id of the end node to be merged
                    sql_node_dict (dict): data of the child in dictionary 
                    format; usual response of SQL when queried.
                Raises:
                    AssertionError: raised if the old and new id are not 
                    found in DB.

                Returns:
                    str: sql query.
                """
                parent_start_id = []
                parent_destination_id = []
                parent_keys = ["parent_1_id", "parent_2_id", "parent_3_id"]
                
                for key in parent_keys:
                    if sql_node_dict[key] == start_id:
                        parent_start_id.append(key)
                    if sql_node_dict[key] == destination_id:
                        parent_destination_id.append(key)
                for l in [parent_start_id, parent_destination_id]:
                    if len(l) >= 2:
                        raise Exception("get_number_parents_matching_id: duplicate parents in that child. Corrupted data.")
                
                # if no current parent has the destination id, replace the id of the merged parent with new one.
                if len(parent_destination_id) == 0:
                    return f"UPDATE ClassificationGraphNodes SET {parent_start_id[0]}={destination_id} WHERE id={sql_node_dict['id']}"
                # if child node already has destination parent as a parent, just delete the merged parent
                if len(parent_destination_id) == 1:
                    return f"UPDATE ClassificationGraphNodes SET {parent_start_id[0]}='NULL' WHERE id={sql_node_dict['id']}"

            # get SQL queries for each child and run
            parent_update_queries = []
            for sql_node in res:
                query = generate_query_for_child_node(start_node_id, destination_node_id, sql_node)

                parent_update_queries.append(query)
            
            # delete start node to be merged
            delete_query = f"DELETE FROM ClassificationGraphNodes WHERE id={start_node_id}"
            update_queries = parent_update_queries + [delete_query]

            self.db.run_query(update_queries)

        except Exception as e:
            logging.error(f"_mergeNode: exception raised: {e}")

    def _renameNode(self, new_field_name, old_field_name=None, node_id=None):
        """Rename a node. Specify old_field_name OR node_id for it to work.

        Args:
            new_field_name ([type]): [description]
            old_field_name ([type], optional): [description]. Defaults to None.
            node_id ([type], optional): [description]. Defaults to None.
        """
        if old_field_name == None and node_id == None:
            Exception("_renameNode: '' and '' cannot be both None.")
        elif old_field_name == None and node_id != None:
            rename_query = f"UPDATE ClassificationGraphNodes SET field='{new_field_name}' WHERE id={node_id}"
        elif old_field_name != None and node_id == None:
            rename_query = f"UPDATE ClassificationGraphNodes SET field='{new_field_name}' WHERE field='{old_field_name}'"
        elif old_field_name != None and node_id != None:
            rename_query = f"UPDATE ClassificationGraphNodes SET field='{new_field_name}' WHERE id={node_id}"

        try:
            response = self.db.run_query(rename_query)
            if response == [0,0]:
                logging.warning("renameNode: unsuccessful, nothing has been updated. Check that node_id exists.")
            else:
                logging.info("_renameNode: successful.")
        except Exception as e:
            logging.warning(f"_renameNode: Exception encountered: {e}")

    def _changeNodeParents(self):
        raise NotImplementedError

    def getChildren(self, parent_field=None, parent_id=None, queried_field="*"):
        if parent_field == None and parent_id == None:
            logging.warning("getChildIds: 'parent_field' and 'parent_id' cannot be both None at the same time.")

        if parent_field != None:
            query_id_parent = f"SELECT id FROM ClassificationGraphNodes WHERE field={parent_field}"
            parent_id = self.db.run_query(query_id_parent)[0]["id"] 

        elif parent_id != None:
            query_childs = f"SELECT {queried_field} FROM ClassificationGraphNodes WHERE parent_1_id = '{parent_id}' OR parent_1_id = '{parent_id}' OR parent_1_id = '{parent_id}'"

        try:
            return self.db.run_query(query_childs)
        except Exception as e:
            logging.error(f"getChildIds: exception raised: {e}")

    # def getAllChildrenIdRecursive2(self, parent_field=None, parent_id=None):
    #     import time
    #     start_time = time.time()


    #     if parent_field == None and parent_id == None:
    #         logging.warning("getAllChildsRecursive: 'parent_field' and 'parent_id' cannot be both None at the same time.")

    #     if parent_field != None:
    #         child_ids = [i["id"] for i in self.getChildren(parent_field=parent_field, queried_field="id")]

    #     elif parent_id != None:
    #         child_ids = [i["id"] for i in self.getChildren(parent_id=parent_id, queried_field="id")]
            
    #     still_ids_to_query = True
    #     all_ids = child_ids.copy()
    #     all_grand_children_ids = []
    #     while still_ids_to_query:
    #         for id in child_ids:
    #             id_query = f"SELECT id FROM ClassificationGraphNodes WHERE parent_1_id = '{id}' OR parent_1_id = '{id}' OR parent_1_id = '{id}'"
    #             id_query_res = self.db.run_query(id_query)
    #             if isinstance(id_query_res, list):
    #                 if len(id_query_res) != 0:
    #                     grand_children_ids = [i["id"] for i in id_query_res]
    #                     all_grand_children_ids = all_grand_children_ids + grand_children_ids
    #         if len(all_grand_children_ids) != 0:
    #             all_ids = all_ids + all_grand_children_ids
    #             child_ids = all_grand_children_ids.copy()
    #             all_grand_children_ids = []
    #         else:
    #             still_ids_to_query = False

    #     end_time = time.time()
    #     print("recursive time", end_time - start_time)
    #     return all_ids

    def getAllChildrenIdRecursive(self, topic_id):
        # setup local data
        all_topics_query = "SELECT * FROM ClassificationGraphNodes"
        all_topics_sql_data = self.db.run_query(all_topics_query)
        
        # NOTE: 
        #   - parents_topics_dict is a dict indexed by child id with field being the list of parents
        #   - children_topics_dict is a dict indexed by parent id with fields being a list of children
        parents_topics_dict = {}
        children_topics_dict = {}
        for topic_dic in all_topics_sql_data:
            i_topic_id = topic_dic["id"]

            # track parents of nodes
            parents_ids = []
            for parent_key in ["parent_1_id", "parent_2_id", "parent_3_id"]:
                parent_id = topic_dic[parent_key]
                if parent_id != None:
                    parents_ids.append(parent_id)
                    # track childs
                    if parent_id in children_topics_dict:
                        children_topics_dict[parent_id].append(i_topic_id)
                    else:
                        children_topics_dict[parent_id] = [i_topic_id]
                        

            parents_topics_dict[i_topic_id] = parents_ids

        if topic_id in children_topics_dict:
            child_ids = children_topics_dict[topic_id]
            if len(child_ids) != 0:
                all_ids = child_ids.copy() 
        else:
            all_ids = []
            child_ids = []
        
        all_grand_children_ids = []
        still_ids_to_check = True
        while still_ids_to_check:
            for id in child_ids:
                if id in children_topics_dict:
                    grand_children_ids = children_topics_dict[id]
                    all_grand_children_ids = all_grand_children_ids + grand_children_ids

            if len(all_grand_children_ids) != 0:
                all_ids = all_ids + all_grand_children_ids
                child_ids = all_grand_children_ids.copy()
                all_grand_children_ids = []
            else:
                still_ids_to_check = False

        return all_ids

    def getParents(self, field_name=None, node_id=None):
        """Method to get the information regarding the parents for a node 
        described by his node_id or field.

        Args:
            node_id (int): MYSQL id of the node

        Returns:
            [list]: list of dictionaries for all the parents.
        """
        if field_name == None and node_id == None:
            raise Exception("getParents: field_name and node_id cannot both be None.")

        elif node_id == None:
            query_id = f"SELECT * FROM ClassificationGraphNodes WHERE field={field_name}"
            res = self.db.run_query(query_id)

            if len(res) == 0:
                raise Exception(f"getParents: no node found with the field_name={field_name}")
            elif len(res) > 1:
                raise Exception(f"getParents: multiple node found with the field_name={field_name}. Check corruption.")
            else:
                node_id = res[0]["id"]

        try:
            parent_id_query = f"SELECT * from ClassificationGraphNodes WHERE id={node_id}"
            res = self.db.run_query(parent_id_query)
            parent_queries = []

            if len(res) == 0:
                raise Exception(f"getParents: node {node_id} not found in DB.")

            for sql_key in ["parent_1_id", "parent_2_id", "parent_3_id"]:
                parent_id = res[0][sql_key]
                if parent_id != None:
                    parent_query = f"SELECT * from ClassificationGraphNodes WHERE id={parent_id}"
                    parent_queries.append(parent_query)

            return self.db.run_query(parent_queries)

        except Exception as e:
            logging.warning(f"getParents: exception: {e}")

    def getTopicsOnTalk(self, talkId):
        result = []
        for i in range(1, 4):
            query = f'SELECT ClassificationGraphNodes.field, ClassificationGraphNodes.is_primitive_node, ClassificationGraphNodes.id, ClassificationGraphNodes.parent_1_id, ClassificationGraphNodes.parent_2_id, ClassificationGraphNodes.parent_3_id FROM ClassificationGraphNodes INNER JOIN Talks ON ClassificationGraphNodes.id = Talks.topic_{i}_id WHERE Talks.id = {talkId}'
            temp = self.db.run_query(query)
            if isinstance(temp, list):
                if len(temp) != 0:
                    result.append(temp[0])
        return result

    def getAllTopics(self):
        select_all_query = "SELECT * from ClassificationGraphNodes"
        try:
            return self.db.run_query(select_all_query)
        except Exception as e:
            logging.error(f"get_whole_graph_in_dict: exception raised: {e}")

    def getDataTreeStructure(self):
        raw_data = self.getAllTopics()
        res = []
        for idx, e in enumerate(raw_data):
            if e['is_primitive_node']:
                res.append({'name': e['field'], 'attributes': {'id': e['id']}, 'children': []})
                del raw_data[idx]

        def getNestedDescendence(data, id_root):
            temp = []
            for idx, e in enumerate(data):
                if e['parent_1_id'] == id_root or e['parent_2_id'] == id_root or e['parent_3_id'] == id_root:
                    temp.append(({'name': e['field'], 'attribute': {'id': e['id']}, 'children': []}))
                    del data[idx]
            
            for e in temp:
                e['children'] = getNestedDescendence(data=data, id_root=e['attribute']['id'])

            return temp

        for e in res:
            e['children'] = getNestedDescendence(data=raw_data, id_root=e['attributes']['id'])

        return res

    def getPopularTopics(self, n):
        raise NotImplementedError

# UNIT TEST
if __name__ == "__main__":
    import pymysql
    import os
    from os.path import join, dirname
    from dotenv import load_dotenv

    dotenv_path = join(dirname(__file__), '.env')
    load_dotenv(dotenv_path)

    class Database:
        def __init__(self):
            host = os.environ.get('host')
            user = os.environ.get('user')
            password = os.environ.get('password')
            db = os.environ.get('db')
            self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
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
                        if 'SELECT' in query:
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
    
    db = Database()
    obj = TopicRepository(db)

    import json

    print(obj.getAllChildrenIdRecursive(topic_id=20))
    # print(obj.getChildren(parent_id=15))


    # with open('/home/cloud-user/plateform/agora/frontend/src/assets/tree.json', 'w') as outfile:
    #    json.dump(obj.getDataTreeStructure(), outfile)

    # with open('/home/cloud-user/plateform/agora/frontend/src/assets/allTopics.json', 'w') as outfile:
    #    json.dump(obj.getAllTopics(), outfile)

    # obj._addChildNode(name_child="TESTEST", parent_name_1="Biology", parent_name_2="Chemistry")
    # obj._renameNode(old_field_name="BIOLOGY", new_field_name="Biology")
    # obj._addPrimitiveNode("TEST_MAIN_BRANCH_2")
    # obj._mergeNode(50, 51)
    # print(obj.getChilds(parent_id=15))
    # print(obj.getParents(27))
    # print(obj.get_whole_graph_in_dict())