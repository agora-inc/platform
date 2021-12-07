from scrapping.ResearchSeminarsScrapper import ResearchSeminarsScrapper
from repository.TalkRepository import TalkRepository


class ScrapperWrapper:
    def __init__(self, scrappers: list):
        self.primitive_topics_dic = {}
        self.scrappers = scrappers

    def load_scrappers(self):
        pass

    def run(self):
        for scrapper in self.scrappers:
            try:
                scrapper().run()
            except Exception as e:
                scrapper._close


if __name__ == "__main__":
    obj = ScrapperWrapper([ResearchSeminarsScrapper]).run()