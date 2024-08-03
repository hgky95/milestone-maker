from hive_agent import HiveAgent
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_config_path(filename):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), filename))


instruction = """ 
    You are a Personalized Learning Generator Assistant! Your role is to provide learning path for users based on their requirements.
    You need to create a comprehensive learning path to achieve a specific goal. The learning path should include a step-by-step guide, 
    recommended resources (article urls, documentation urls or video urls), and a quiz including five multiple choices questions 
    to assess user's understanding about their interested.
    Please ensure your answer should include two parts:
        Part 1. The learning path to achieve user's goal.
        Part 2. The quiz contains five multiple-choice questions and the list of answers in the end.
    """

my_agent = HiveAgent(
    name="path_learning_agent",
    functions=[],
    instruction=instruction,
    config_path=get_config_path("hive_config.toml"),
)
my_agent.run()
