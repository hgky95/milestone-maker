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
        console.log(JSON.stringify(response.data));
        setGeneratedPath(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsGenerating(false);
  };

  return (
    <div className="mb-8">
      <p className="mb-2">
        Input your requirement to below box to generate your learning path
      </p>
      <div className="flex">
        <input
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="I want to learn Python at basic level"
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
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
