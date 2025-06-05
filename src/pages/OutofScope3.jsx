import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, ChevronDown, Search } from "lucide-react";
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";
import user4 from "../assets/user4.png";
import user5 from "../assets/user5.png";

const USERS = [
  { name: "User 1", icon: user1 },
  { name: "User 2", icon: user2 },
  { name: "User 3", icon: user3 },
  { name: "User 4", icon: user4 },
  { name: "User 5", icon: user5 },
];

export default function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
  const [viewRequestModal, setViewRequestModal] = useState(null);
  const [flowStarted, setFlowStarted] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/tasks/raised-to-spoc/") // Your Django endpoint
      .then((res) => {
        setTasks(res.data);
        setAssignedUsers(res.data.map(() => [])); // Initialize assignment
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  }, []);

  const toggleUser = (rowIndex, user) => {
    setAssignedUsers((prev) => {
      const current = [...prev[rowIndex]];
      const exists = current.find((u) => u.name === user.name);
      let updated;
      if (exists) {
        updated = current.filter((u) => u.name !== user.name);
      } else {
        if (current.length >= 5) return prev;
        updated = [...current, user];
      }
      const newState = [...prev];
      newState[rowIndex] = updated;
      return newState;
    });
  };

  const filteredTasks = tasks.filter((item) =>
    item.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-700 text-left">
              <th className="px-4 py-2 font-semibold">Client Name</th>
              <th className="px-4 py-2 font-semibold">Workspace Name</th>
              <th className="px-4 py-2 font-semibold">Domain Name</th>
              <th className="px-4 py-2 font-semibold">Deadline</th>
              <th className="px-4 py-2 font-semibold">Client Request</th>
              <th className="px-4 py-2 font-semibold">Create flow</th>
              <th className="px-4 py-2 font-semibold">Task Assigned to</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTasks.map((item, rowIndex) => (
              <tr key={rowIndex} className="whitespace-nowrap text-gray-700">
                <td className="px-4 py-2">{item.client_name}</td>
                <td className="px-4 py-2">{item.workspace_name}</td>
                <td className="px-4 py-2">{item.domain_name || "N/A"}</td>
                <td className="px-4 py-2">{item.deadline || "N/A"}</td>
                <td
                  className="px-4 py-2 text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
                  onClick={() => setViewRequestModal(rowIndex)}
                >
                  <Eye size={16} /> View Request
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium"
                    style={{ padding: "6px 16px", height: "36px", minWidth: "100px" }}
                    onClick={() => setFlowStarted(rowIndex)}
                  >
                    View Flow
                  </button>
                </td>
                <td className="px-4 py-2 relative">
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {assignedUsers[rowIndex].map((u, i) => (
                        <img
                          key={i}
                          src={u.icon}
                          alt={u.name}
                          className="w-7 h-7 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <ChevronDown
                      className="cursor-pointer"
                      onClick={() =>
                        setDropdownOpenIndex(
                          dropdownOpenIndex === rowIndex ? null : rowIndex
                        )
                      }
                    />
                  </div>
                  {dropdownOpenIndex === rowIndex && (
                    <div className="absolute z-10 bg-white border rounded shadow-md mt-2 p-2 w-40">
                      {USERS.map((user, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleUser(rowIndex, user)}
                        >
                          <img src={user.icon} alt={user.name} className="w-6 h-6 rounded-full" />
                          <span className="text-sm text-gray-700">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Request Modal */}
      {viewRequestModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[600px] max-w-full">
            <h2 className="text-xl font-semibold mb-4">Client Request Details</h2>
            <p>{tasks[viewRequestModal]?.description || "No description provided."}</p>
            <div className="text-right mt-4">
              <button
                onClick={() => setViewRequestModal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flow Started Modal */}
      {flowStarted !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[500px] text-center">
            <h2 className="text-xl font-semibold mb-2">Flow Started</h2>
            <p className="mb-4">
              Workflow has been successfully started for{" "}
              <strong>{filteredTasks[flowStarted].client_name}</strong>.
            </p>
            <button
              onClick={() => setFlowStarted(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
