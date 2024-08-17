import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface LearningPathProps {
  id: number;
  status: string;
  ipfsHash: string;
  milestones: string[];
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

  useEffect(() => {
    if (isExpanded && !pathData) {
      fetchIPFSData();
    }
  }, [isExpanded, ipfsHash]);

  const fetchIPFSData = async () => {
    try {
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      );
      setPathData(response.data);
      setCompletedTasks(
        new Array(response.data.learning_path.length).fill(false)
      );
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

  return (
    <div className="mb-4 border rounded-lg p-4">
      <div
        className="cursor-pointer flex justify-between items-center"
        onClick={toggleExpand}
      >
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
              {/* Display questionnaire from IPFS data */}
              {/* You'll need to implement this based on your data structure */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningPath;
