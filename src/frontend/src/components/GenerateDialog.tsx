import { useState } from "react";
import axios from "axios";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function GenerateDialog({
  path,
  account,
  generated_session_id,
  onAccept,
  onClose,
}: {
  path: any;
  account: any;
  generated_session_id: any;
  onAccept: () => void;
  onClose: () => void;
}) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    console.log("Storing data to IPFS and Smart Contract...");
    const axios = require("axios");
    let data = JSON.stringify({
      user_id: account,
      session_id: generated_session_id,
      chat_data: {
        messages: [
          {
            role: "user",
            content:
              "Here is my wallet address: " +
              account +
              " . Please help to store the learning path: " +
              JSON.stringify(path),
          },
        ],
      },
    });

    let config = {
      method: "post",
      url: BACKEND_API,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      onAccept();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg relative max-w-3xl w-full">
        {/* Top Bar with Title and Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Generated Learning Path</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Learning Path Display */}
        <div className="bg-gray-100 p-4 rounded mb-4 max-h-96 overflow-y-auto">
          {path.learning_path.map((task: any, index: number) => {
            const taskKey = Object.keys(task)[0];
            const taskDetails = task[taskKey];
            return (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  {`${taskKey.replace("_", " ")}: ${taskDetails.Title}`}
                </h3>
                <p className="mb-1">
                  <strong>Objective:</strong> {taskDetails.Objective}
                </p>
                <p className="mb-1">
                  <strong>Activities:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {taskDetails.Activities.map((activity: string, i: number) => {
                    const linkMatch = activity.match(/\[Link\]\((.*?)\)/);
                    const text = activity.replace(/\[Link\]\(.*?\)/, "").trim();
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
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            disabled={isAccepting}
          >
            {isAccepting ? (
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              "Accept"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
