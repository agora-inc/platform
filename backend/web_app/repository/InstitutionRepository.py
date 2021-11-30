import logging


class InstitutionRepository:
    def __init__(self, db):
        self.db = db

    def isEmailVerifiedAcademicEmail(self, email):
        email_ending = email.split("@")[1]

        check_academic_query = f'''
            SELECT 
                domain
            FROM InstitutionsEmailDomains
            WHERE domain = "{email_ending}";
        '''
        res = self.db.run_query(check_academic_query)
        emailIsAcademic = not (res == None or len(res) == 0)

        return emailIsAcademic

    def getInstitutionsFromEmail(self, email):
        email_ending = email.split("@")

        check_academic_query = f'''
            SELECT 
                *
            FROM Institutions
            INNER JOIN InstitutionsEmailDomains
            WHERE (
                Institutions.id = InstitutionsEmailDomains.institution_id"
                AND InstitutionsEmailDomains.domain = {email_ending}
                )
            ;
        '''
        res = self.db.run_query(check_academic_query)
        return res
