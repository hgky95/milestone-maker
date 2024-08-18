import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface LearningPathProps {
  id: number;
  status: string;
  ipfsHash: string;
  milestones: boolean[];
  completed: boolean;
  achievementMinted: boolean;
  account: any;
}

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API || "";

const LearningPath: React.FC<LearningPathProps> = ({
  id,
  status,
  ipfsHash,
  milestones,
  completed,
  achievementMinted,
  account,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pathData, setPathData] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const generated_session_id = uuidv4();

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    fetchIPFSData();
  }, [isExpanded, ipfsHash]);

  useEffect(() => {
    if (pathData && pathData.quizzes) {
      setQuizzes(pathData.quizzes);
    }
  }, [pathData]);

  const fetchIPFSData = async () => {
    console.log("ID: ", id);
    console.log("status: ", status);
    console.log("ipfs: ", ipfsHash);
    console.log("milestones: ", milestones);
    console.log("completed: ", completed);
    console.log("achievementMinted: ", achievementMinted);
    try {
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      );
      setPathData(response.data);
      setCompletedTasks(milestones);
    } catch (error) {
      console.error("Error fetching IPFS data:", error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxChange = async (index: number) => {
    const newCompletedTasks = [...completedTasks];
    newCompletedTasks[index] = !newCompletedTasks[index];
    setCompletedTasks(newCompletedTasks);

    if (newCompletedTasks.every((task) => task)) {
      setShowQuestionnaire(true);
    }

    try {
      let data = JSON.stringify({
        user_id: account,
        session_id: generated_session_id,
        chat_data: {
          messages: [
            {
              role: "user",
              content:
                "Update the milestones for user address: " +
                account +
                " , learning path id is: " +
                id +
                " , milestones value is: " +
                completedTasks,
            },
          ],
        },
      });

      const config = {
        method: "post",
        url: BACKEND_API,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error updating milestones:", error);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    const newUserAnswers = [...userAnswers, answer];
    setUserAnswers(newUserAnswers);

    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      // Quiz completed
      handleQuizPassed(newUserAnswers);
    }
  };

  const handleQuizPassed = async (newUserAnswers: any) => {
    setQuizCompleted(true);
    const correctAnswers = newUserAnswers.filter(
      (userAnswer: any, index: number) =>
        userAnswer === quizzes[index][`Quiz_${index + 1}`].answer
    ).length;
    if (correctAnswers >= 4) {
      try {
        let data = JSON.stringify({
          user_id: account,
          session_id: generated_session_id,
          chat_data: {
            messages: [
              {
                role: "user",
                content:
                  "Set quiz passed for user address: " +
                  account +
                  " , learning path id is: " +
                  id,
              },
            ],
          },
        });

        const config = {
          method: "post",
          url: BACKEND_API,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));

        setQuizPassed(true);
      } catch (error) {
        console.log("Error set quiz passed:", error);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setQuizPassed(false);
  };

  const renderQuiz = () => {
    if (!quizzes.length || quizCompleted) return null;

    const currentQuiz =
      quizzes[currentQuizIndex][`Quiz_${currentQuizIndex + 1}`];
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="text-xl font-semibold mb-2">
          Quiz {currentQuizIndex + 1}
        </h3>
        <p className="mb-2">{currentQuiz.question}</p>
        {currentQuiz.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleQuizAnswer(option[0])}
            className="block w-full text-left p-2 mb-2 bg-white rounded hover:bg-red-100"
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  const renderQuizResults = () => {
    if (!quizCompleted) return null;

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="text-xl font-semibold mb-2">Quiz Results</h3>
        <p>
          <p>
            {quizPassed
              ? "Congratulations! You passed the quiz."
              : "Sorry, you didn't pass the quiz. You can try again."}
          </p>
          {!quizPassed && (
            <button
              onClick={resetQuiz}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Retry Quiz
            </button>
          )}
        </p>
        {quizPassed && !achievementMinted && (
          <button
            onClick={handleMintNFT}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mint Achievement NFT
          </button>
        )}
      </div>
    );
  };

  const handleMintNFT = async () => {
    // Implement NFT minting logic here
    console.log("Minting NFT...");
  };

  return (
    <div className="mb-4 border rounded-lg p-4">
      <div
        className="cursor-pointer flex justify-between items-center"
        onClick={toggleExpand}
      >
        {pathData && pathData.title && (
          <span className="font-medium">Title: {pathData.title}</span>
        )}
        <span>Status: {status}</span>
        <span>{isExpanded ? "▲" : "▼"}</span>
      </div>
      {isExpanded && pathData && (
        <div className="mt-4">
          <p>IPFS Hash: {ipfsHash}</p>
          <div className="bg-gray-100 p-4 rounded mb-4 max-h-96 overflow-y-auto">
            {pathData.learning_path.map((task: any, index: number) => {
              const taskKey = Object.keys(task)[0];
              const taskDetails = task[taskKey];
              return (
                <div key={index} className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={completedTasks[index]}
                      disabled={completedTasks[index] == true}
                      onChange={() => handleCheckboxChange(index)}
                      className="mr-2"
                    />
                    <h3 className="text-xl font-semibold mb-2">
                      {`${taskKey.replace("_", " ")}: ${taskDetails.Title}`}
                    </h3>
                  </div>
                  <p className="mb-1">
                    <strong>Objective:</strong> {taskDetails.Objective}
                  </p>
                  <p className="mb-1">
                    <strong>Activities:</strong>
                  </p>
                  <ul className="list-disc pl-5">
                    {taskDetails.Activities.map(
                      (activity: string, i: number) => {
                        const linkMatch = activity.match(/\[Link\]\((.*?)\)/);
                        const text = activity
                          .replace(/\[Link\]\(.*?\)/, "")
                          .trim();
                        return (
                          <li key={i} className="mb-1">
                            {text}{" "}
                            {linkMatch && (
                              <a
                                href={linkMatch[1]}
                                className="text-blue-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Link
                              </a>
                            )}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
          {showQuestionnaire && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Questionnaire</h3>
              {renderQuiz()}
              {renderQuizResults()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningPath;
