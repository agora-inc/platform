'''
    Base class for scrapper. 

    Example setup:
                params = {
                    "use_selenium": False,
                    "need_primitive_topics": False,
                    # "repositories": [
                    #     ChannelRepository,
                    #     TalkRepository
                    # ]

                    "
                }

'''
import abc
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import importlib
import ast
from databases import agora_db


CHROME_V_96_PATH = "/home/cloud-user/plateform/agora/backend/web_app/scrapping/chromedrivers/v_96/chromedriver"


class BaseScrapper(metaclass=abc.ABCMeta):
    def __init__(self, params: dict):
        # lock vars
        self.params = params

        self.data = []
        self.selenium_driver = None
        self.talks = None
        self.channels = None
        self.users = None

        self._setup()

    #####################
    # BASE METHODS
    #####################
    @abc.abstractmethod
    def fetch_data():
        raise NotImplementedError

    @abc.abstractmethod
    def add_new_data_point():
        raise NotImplementedError

    @abc.abstractmethod
    def update_data_point():
        raise NotImplementedError

    def _selenium_login(self):
        raise NotImplementedError

    def _selenium_logoff(self):
        raise NotImplementedError

    #####################
    # CLASS BUILDER
    #####################
    def _setup(self):
        print("init")
        # setup
        if "use_selenium" in self.params:
            try:
                if self.params["use_selenium"]:
                    self._setup_selenium()
                    self._selenium_login()
            except Exception as e:
                print(f"Exception: {e}")

        if "need_primitive_topics" in self.params:
            try:
                if self.params["need_primitive_topics"]:
                    self._load_primitive_topics()
            except Exception as e:
                print(f"Exception: {e}")

        if "repositories" in self.params:
            try:
                for repo_name in self.params["repositories"]:
                    if "TalkRepository" == repo_name:
                        module = importlib.import_module("repository." + repo_name)
                        repoClass = getattr(module, 'TalkRepository')
                        self.talks = repoClass(db=agora_db)

                    if "ChannelRepository" == repo_name:
                        module = importlib.import_module("repository." + repo_name)
                        repoClass = getattr(module, 'ChannelRepository')
                        self.channels = repoClass(db=agora_db)

            except Exception as e:
                print(f"Exception: {e}")       
                
    def _close(self):
        if "use_selenium" in self.params:
            if self.params["use_selenium"]:
                self._selenium_logoff()

    #####################
    # DATA LOADERS
    #####################
    def _load_primitive_topics(self):
        # Store in memory id main nodes
        # Load dictionary for primitive node classification. 
        file = open("primitive_topics.txt")
        contents = file.read()
        self.primitive_topics_dic = ast.literal_eval(contents)
        file.close()


    #####################
    # MODULE LOADERS
    #####################
    def _setup_selenium(self):
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options

        # Set-up selenium
        options = Options()
        options.headless = True
        options.add_argument("--window-size=1920,1200")
        self.selenium_driver = webdriver.Chrome(
			options=options, 
			executable_path = CHROME_V_96_PATH
        )

