import json
import sys

# HACK:
sys.path.append("/home/cloud-user/plateform/agora/backend/web_app/app/")
from databases import SqlDatabase
# Source of all unis / institutions: https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json



class emailAcademicFetcher:
    def __init__(self, 
    source_json_path="/home/cloud-user/plateform/agora/backend/tools/update_tools/email_db/world_universities_and_domains.json"):
    
        self.source_json_path = source_json_path
        self.raw_world_unis_domain_from_json = []
        self.preprocessed_world_unis_domain_from_json = []
        self.db = SqlDatabase()
        
        self.fetch_world_unis_domain_json()


    def fetch_world_unis_domain_json(self):
        with open(self.source_json_path, "r") as file:
            raw_data = json.load(file)

        self.preprocess_dict()


    def preprocess_dict(self, raw_dic):
        """[summary]

        Args:
            raw_dic (dictionary): Source format:   
                {
                    "web_pages": [
                    "http://www.marywood.edu"
                    ],
                    "name": "Marywood University",
                    "alpha_two_code": "US",
                    "state-province": null,
                    "domains": [
                    "marywood.edu"
                    ],
                    "country": "United States"
                },

        Returns:
            [type]: [description]
        """
        return {}



    def add_emails_in_db(self):
        mass_insert_query = '''
            INSERT INTO table_name(field_1,field_2,field_3) VALUES ( %(id)s, %(price)s, %(type)s);"
        '''

        # cur = self.db.con.cursor()
        # cur.executemany(mass_insert_query, self.preprocessed_world_unis_domain_from_json)
        # cur.commit

        print(self.db)
        print("yes")

    def run(self):
        pass




if __name__ == "__main__":
    # pwd = input("Careful before using this!: Write password.")
    # if pwd == "yesman":
    #     add_emails_in_db()
    obj = emailAcademicFetcher()
    obj.add_emails_in_db()