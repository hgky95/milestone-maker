import { useState } from "react";

interface SidebarProps {
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onPageChange }) => {
  const [activePage, setActivePage] = useState("home");

  const handlePageChange = (page: string) => {
    setActivePage(page);
    onPageChange(page);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-gray-800 flex flex-col items-center py-4">
      <div
        className={`mb-4 p-2 rounded-full cursor-pointer ${
          activePage === "home" ? "bg-blue-500" : "hover:bg-gray-700"
        }`}
        onClick={() => handlePageChange("home")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      <div
        className={`p-2 rounded-full cursor-pointer ${
          activePage === "achievements" ? "bg-blue-500" : "hover:bg-gray-700"
        }`}
        onClick={() => handlePageChange("achievements")}
      >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg> */}
        <svg
          className="h-8 w-8 text-red-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <line x1="8" y1="21" x2="16" y2="21" />{" "}
          <line x1="12" y1="17" x2="12" y2="21" />{" "}
          <line x1="7" y1="4" x2="17" y2="4" />
          <path d="M17 4v8a5 5 0 0 1 -10 0v-8" /> <circle cx="5" cy="9" r="2" />{" "}
          <circle cx="19" cy="9" r="2" />
        </svg>
      </div>
    </div>
  );
};

export default Sidebar;
