import autogen
from flask import request
from autogen.agentchat import AssistantAgent

from flask_restful import Resource

from AIConfiguration import AIConfiguration
from Chat import Chat
import time
import json


class AIIntegration(Resource):

    def post(self):
        start_time = time.time()

        data = request.get_json()
        user_address = data['user_address']
        requirement = data['requirement']

        # Start logging
        logging_session_id = autogen.runtime_logging.start(config={"dbname": "logs.db"})
        print("Logging session ID: " + str(logging_session_id))

        # Create agents
        learning_generator_agent = self.create_learning_generator_agent()
        formatter_agent = self.create_formatter_agent()
        user_proxy = self.create_user_proxy_agent()

        # Create chat queues
        chat_queues = []
        generator_instruction = f"""
                                   You are a Personalized Learning Generator Assistant! Your role is to provide learning path for users based on their requirements.
                                    You need to create a comprehensive learning path to achieve a specific goal. The learning path should include a step-by-step guide, 
                                    recommended resources (article urls, documentation urls or video urls), and a quiz including five multiple choices questions 
                                    to assess user's understanding about their interested.
                                    Please ensure your answer should include two parts:
                                        Part 1. The learning path to achieve user's goal.
                                        Part 2. The quiz contains five multiple-choice questions and the list of answers in the end.
                                    Here is the requirement from user: {requirement}
                                    """

        learning_path = Chat(learning_generator_agent, generator_instruction, False).toDict()
        chat_queues.append(learning_path)
        self.add_learning_path_to_queues(chat_queues, formatter_agent, learning_path)
        chat_results = user_proxy.initiate_chats(chat_queues)
        learning_path_json = chat_results[1].summary
        learning_path_json_formatted = learning_path_json.replace('```json', '').replace('```', '')
        print(learning_path_json_formatted)

        autogen.runtime_logging.stop()

        end_time = time.time()
        consumed_time = end_time - start_time
        print(f"Time consumed: {consumed_time} seconds")
        return chat_results

    def create_user_proxy_agent(self):
        user_proxy = autogen.UserProxyAgent(
            name="user_proxy",
            human_input_mode="NEVER",
            code_execution_config=False,
            max_consecutive_auto_reply=0,
        )
        return user_proxy

    def create_learning_generator_agent(self):
        learning_generator = AssistantAgent(
            "learning_generator",
            llm_config=AIConfiguration.learning_generator_llm_config,
        )
        return learning_generator

    def create_formatter_agent(self):
        formatter = AssistantAgent(
            name="formatter",
            llm_config=AIConfiguration.formatter_llm_config
        )
        return formatter





    def add_learning_path_to_queues(self, chat_queues, formatter, learning_path_and_quizzes):
        example_learning_path = [
            {
                "Task_1": {
                    "Title": "Introduction to Blockchain",
                    "Objective": "Understand the basic concepts and terminology of blockchain technology.",
                    "Activities": [
                        "Read the article 'What is Blockchain Technology?' [Link](https://www.ibm.com/topics/what-is-blockchain)",
                        "Watch the video 'Blockchain Explained' (YouTube) [Link](https://www.youtube.com/watch?v=SSo_EIwHSd4)",
                        "Take notes on key terms: decentralization, distributed ledger, consensus mechanism."
                    ]
                }
            },
            {
                "Task_2": {
                    "Title": "How Blockchain Works",
                    "Objective": "Learn how blockchain operates and the components involved.",
                    "Activities": [
                        "Read the article 'How Does Blockchain Work?' [Link](https://www.investopedia.com/terms/b/blockchain.asp)",
                        "Watch the video 'How Blockchain Works' (YouTube) [Link](https://www.youtube.com/watch?v=HY2g2Y1g3fE)",
                        "Create a simple diagram illustrating the blockchain process (blocks, transactions, miners)."
                    ]
                }
            }
        ]

        example_quizzes = [
            {
                "Quiz_1": {
                    "question": "What is a blockchain?",
                    "options": [
                        "a) A type of cryptocurrency",
                        "b) A decentralized digital ledger",
                        "c) A social media platform",
                        "d) A programming language"
                    ],
                    "answer": "b"
                }
            },
            {
                "Quiz_2": {
                    "question": "Which of the following is a key feature of blockchain technology?",
                    "options": [
                        "a) Centralized control",
                        "b) Transparency",
                        "c) High transaction fees",
                        "d) Limited access"
                    ],
                    "answer": "b"
                }
            }
        ]

        json_data = {
            "learning_path": example_learning_path,
            "quizzes": example_quizzes
        }

        json_str = json.dumps(json_data)

        message = f"""
        You have the learning path and the related quizzes {learning_path_and_quizzes}, and it is provided by the learning_generator.
        Your main responsibility is to read through the learning path and quizzes then format it into json format. 
        Below is one example of expected json:
        {json_str}
        Important: you need to return the json as the output.
        """
        chat_queues.append(Chat(formatter, message, False).toDict())
