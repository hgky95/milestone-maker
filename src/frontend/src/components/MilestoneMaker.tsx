"use client";

import { useState } from "react";
import GenerateDialog from "./GenerateDialog";
import { v4 as uuidv4 } from "uuid";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function MilestoneMaker({
  fetchLearningPath,
  account,
}: {
  fetchLearningPath: any;
  account: any;
}) {
  const [requirement, setRequirement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState(null);
  const generated_session_id = uuidv4();

  const handleGenerate = async () => {
    setIsGenerating(true);
    const axios = require("axios");
    let data = JSON.stringify({
      user_id: account,
      session_id: generated_session_id,
      chat_data: {
        messages: [
          {
            role: "user",
            content: requirement,
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
        console.log("Response.data ", response.data);
        setGeneratedPath(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  return (
    <div className="relative mb-8">
      {isGenerating && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <p className="mb-2">
        Input your requirement to below box to generate your learning path
      </p>
      <div className="flex">
        <input
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="I want to learn..."
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleGenerate}
          disabled={account == null}
          className={`${
            account
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white font-bold py-2 px-4 rounded-r`}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>
      {generatedPath && (
        <GenerateDialog
          account={account}
          generated_session_id={generated_session_id}
          path={generatedPath}
          onAccept={() => {
            fetchLearningPath();
            setGeneratedPath(null);
          }}
          onClose={() => setGeneratedPath(null)}
        />
      )}
    </div>
  );
}
