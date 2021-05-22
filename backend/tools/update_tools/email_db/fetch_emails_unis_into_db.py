import json
import sys

# HACK:
sys.path.append("/home/cloud-user/plateform/agora/backend/web_app/app/")
from databases import SqlDatabase

# Source of all unis / institutions: 
# https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json


def _debug_test(file_name, content):
    with open(f"""/home/cloud-user/test/{file_name}.txt""", "w") as file:
        file.write(str(content))


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
            self.raw_world_unis_domain_from_json = json.load(file)

    def _pp_string(self, string):
        """preprocessed string

        Args:
            string ([type]): [description]

        Returns:
            [type]: [description]
        """
        return string.replace('''"''',"").replace("\\","").replace(";", "")

    def integrate_world_unis_domain_json_into_db(self):
        """ 
        Adds / updates our DB with all institutions in that DB.
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
            dictionary: following format:
            {

            }
        """   
        for institution in self.raw_world_unis_domain_from_json:

            ## (first insert country, then institution, then domains
            # A. Add / check country
            get_id_country_db = f'''
                SELECT id
                FROM Countries
                WHERE alpha_two_code = "{institution["alpha_two_code"]}";
            '''

            res = self.db.run_query(get_id_country_db)

            if res == None or len(res) == 0:
                insert_country_query = f'''
                    INSERT INTO Countries (
                        name,
                        alpha_two_code
                    )
                    VALUES (
                        "{self._pp_string(institution["country"])}",
                        "{institution["alpha_two_code"]}"
                    );
                '''
                res = self.db.run_query(insert_country_query)


                country_id = res[0]
            else:
                country_id = res[0]["id"]


            # B. Check/add institution
            check_existence_institution = f'''
                SELECT id FROM Institutions
                WHERE name = "{institution["name"]}";
            '''

            res = self.db.run_query(check_existence_institution)
            institution_does_not_exist = (res is None or len(res) == 0)

            if institution_does_not_exist:
                print(f"Adding: {institution}")
                homepage_url = self._pp_string(institution["web_pages"][0]) if "web_pages" in institution else ""

                insert_institutions_table_query = f'''
                    INSERT INTO Institutions (
                        name,
                        country_id,
                        homepage_url
                    )
                    VALUES (
                        "{self._pp_string(institution["name"])}",
                        {country_id},
                        "{homepage_url}"
                    );
                '''
                try:
                    res = self.db.run_query(insert_institutions_table_query)
                    institution_id = res[0]
                except Exception as e:
                    _debug_test("mj_err_b", str(e) + "  " + insert_institutions_table_query)
            else:
                institution_id = res[0]["id"]

            # C. add domains
            existing_domains_query = f'''
                    SELECT domain 
                    FROM InstitutionsEmailDomains
                    WHERE institution_id = {institution_id};
                '''

            res = self.db.run_query(existing_domains_query)
            existing_domains = [i["domain"] for i in res]

            domains = institution["domains"]
            for domain in domains:
                # i) check if already exists
                if domain in existing_domains:
                    if institution_does_not_exist:
                        print(f"Skipped: {institution}")

                # ii) if not, 
                else:
                    print(f'''Adding new domain: {domain} for {institution["name"]}''')
                    insert_domain_query = f'''
                        INSERT INTO InstitutionsEmailDomains (
                            domain,
                            institution_id
                        )
                        VALUES (
                            "{self._pp_string(domain)}",
                            {institution_id}
                        );
                    '''
                    try:
                        res = self.db.run_query(insert_domain_query)
                        print(f"Updated: {institution}")
                    except Exception as e:
                        _debug_test("mj_err_c", str(e) + "  " + insert_domain_query)
                        


if __name__ == "__main__":
    txt = input("This script is going to run for several minutes. Are you sure you want to proceed?")
    if txt == "":
        sys.exit()
    elif txt[0].lower() != "y":
        sys.exit()
    obj = emailAcademicFetcher()
    obj.integrate_world_unis_domain_json_into_db()