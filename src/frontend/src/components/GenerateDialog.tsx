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
  const handleAccept = async () => {
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
              path,
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

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        onAccept();
      })
      .catch((error) => {
        console.log(error);
      });
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
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
