import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, X } from "lucide-react";

export default function ClientRequestTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [spocDate, setSpocDate] = useState("");
  const [dateError, setDateError] = useState("");


  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/tasks/out-of-scope/")
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch tasks.");
        setLoading(false);
      });
  }, []);

  const openModal = (type, task) => {
    setSelectedTask(task);
    setModalContent(type);
    setSpocDate(""); // Reset date when opening modal
  };

  const closeModal = () => {
    setModalContent(null);
    setSelectedTask(null);
    setSpocDate("");
  };

const handleRaiseToSpoc = async (taskId) => {
  if (!spocDate) {
    setDateError("Please select a date.");
    return;
  }
  try {
    await axios.post(`http://localhost:8000/api/users/tasks/${taskId}/raise-to-spoc/`, {
      deadline: spocDate,
    });
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, raised_to_spoc: true } : task
      )
    );
    closeModal();
    setSpocDate("");
    setDateError("");
  } catch (err) {
    console.error("Error raising to SPOC", err);
  }
};


  const approvalStatusDisplay = (status) => {
    switch (status) {
      case "accepted":
        return { label: "Accepted", className: "bg-green-100 text-green-600" };
      case "rejected":
        return { label: "Rejected", className: "bg-red-100 text-red-600" };
      case "pending":
      default:
        return { label: "Pending", className: "bg-yellow-100 text-yellow-600" };
    }
  };

  const paymentStatusDisplay = (status) => {
    switch (status) {
      case "done":
        return { label: "Completed", className: "bg-green-100 text-green-600" };
      case "unavailable":
        return { label: "Unavailable", className: "bg-gray-200 text-gray-700" };
      case "pending":
      default:
        return { label: "Pending", className: "bg-yellow-100 text-yellow-600" };
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!tasks.length) return <div>No tasks found.</div>;

  return (
    <div className="overflow-auto rounded-lg border border-gray-200 relative">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700 text-left">
            <th className="px-4 py-2 font-semibold">Client Name</th>
            <th className="px-4 py-2 font-semibold">Workspace Name</th>
            <th className="px-4 py-2 font-semibold">Domain Name</th>
            <th className="px-4 py-2 font-semibold">Request Raised Date</th>
            <th className="px-4 py-2 font-semibold">Client Request</th>
            <th className="px-4 py-2 font-semibold">Scope of service</th>
            <th className="px-4 py-2 font-semibold">Approval Status</th>
            <th className="px-4 py-2 font-semibold">Reason</th>
            <th className="px-4 py-2 font-semibold">Payment Status</th>
            <th className="px-4 py-2 font-semibold">Raise to SPOC</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.map((task) => {
            const approval = approvalStatusDisplay(task.client_acceptance_status);
            const payment = paymentStatusDisplay(task.payment_status);

            return (
              <tr key={task.id} className="whitespace-nowrap text-gray-700">
                <td className="px-4 py-2">{task.client_name || "N/A"}</td>
                <td className="px-4 py-2">{task.workspace_name || "N/A"}</td>
                <td className="px-4 py-2">{task.domain_name || "N/A"}</td>
                <td className="px-4 py-2">{new Date(task.created_at).toLocaleDateString()}</td>

                <td className="px-4 py-2 text-blue-600 font-medium flex items-center gap-1 cursor-pointer" onClick={() => openModal("Request", task)}>
                  <Eye size={16} /> View Request
                </td>

                <td className="px-4 py-2 text-blue-600 font-bold cursor-pointer" onClick={() => openModal("Scope", task)}>
                  View Scope
                </td>

                <td className="px-4 py-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${approval.className}`}>
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    {approval.label}
                  </span>
                </td>

                <td className="px-4 py-2">
                  {task.client_acceptance_status === "rejected" ? (
                    <span className="text-blue-600 font-medium flex items-center gap-1 cursor-pointer" onClick={() => openModal("Reason", task)}>
                      <Eye size={16} /> View Reason
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </td>

                <td className="px-4 py-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${payment.className}`}>
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    {payment.label}
                  </span>
                </td>
                <td className="px-5 py-2">
                  {task.raised_to_spoc ? (
                    <span className="text-green-600 font-semibold">Raised</span>
                  ) : task.client_acceptance_status === "rejected" ? (
                    <button
                      className="w-[110px] h-[32px] text-gray-700 rounded-md bg-gray-300 hover:bg-gray-400"
                      onClick={() => openModal("Alert", task)}
                    >
                      Raise Alert
                    </button>
                  ) : (
                    <button
                      className="w-[110px] h-[32px] text-white rounded-md bg-blue-600 hover:bg-blue-700"
                      onClick={() => openModal("SPOC", task)}
                    >
                      Raise to SPOC
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {modalContent && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[450px] rounded-xl p-6 shadow-xl relative animate-fadeIn max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {modalContent === "Request" && "Client Request"}
              {modalContent === "Scope" && "Scope of Work"}
              {modalContent === "Reason" && "Rejection Reason"}
              {modalContent === "Alert" && "Raise Alert"}
              {modalContent === "SPOC" && "Raise to SPOC"}
            </h2>

            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {modalContent === "Request" && (
                <>
                  <strong>Title: </strong> {selectedTask.title}
                  <br />
                  <strong>Description: </strong> {selectedTask.description || "No description provided."}
                </>
              )}

              {modalContent === "Scope" && (
                <>{selectedTask.status ? selectedTask.status.replace(/_/g, " ") : "No status available."}</>
              )}

              {modalContent === "Reason" && (
                <>
                  {selectedTask.rejection_reason || "No rejection reason provided."}
                </>
              )}

              {modalContent === "Alert" && (
                <p>This request is flagged for alert. Please take appropriate action.</p>
              )}

              {modalContent === "SPOC" && (
                <>
                  <p className="mb-2">This request will be raised to SPOC for further processing.</p>
                  <label className="block mb-2 font-medium">Select SPOC Deadline:</label>
                  <input
                    type="date"
                    className="w-full mb-4 px-3 py-2 border rounded text-sm"
                    value={spocDate}
                    onChange={(e) => setSpocDate(e.target.value)}
                    required
                  />
                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleRaiseToSpoc(selectedTask.id)}
                  >
                    Confirm Raise to SPOC
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
