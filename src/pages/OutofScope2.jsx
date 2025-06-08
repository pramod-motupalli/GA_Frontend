import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, X } from "lucide-react";

const chargesData = [
  { label: "For Designing", hours: 1, rate: 10000 },
  { label: "Content Writing", hours: 1, rate: 20000 },
  { label: "For Development", hours: 1, rate: 30000 },
];

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChargesPopup, setShowChargesPopup] = useState(false);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [showScopePopup, setShowScopePopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rejectedRows, setRejectedRows] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showProceedButton, setShowProceedButton] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


useEffect(() => {
  const token = localStorage.getItem("accessToken");

  axios
    .get("http://localhost:8000/api/users/clients/tasks/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setData(res.data); // includes workspace ID/name with each task
      setLoading(false);
    })
    .catch((err) => {
      setError("Failed to fetch your tasks.");
      setLoading(false);
    });
}, []);




  const totalPrice = chargesData.reduce((sum, item) => sum + item.hours * item.rate, 0);

  const handleAccept = async (rowIndex) => {
    try {
      const task = data[rowIndex];
      await axios.post(`http://localhost:8000/api/users/tasks/${task.id}/accept/`);
      const updatedTask = { ...task, client_acceptance_status: "accepted" };
      const newData = [...data];
      newData[rowIndex] = updatedTask;
      setData(newData);
      setShowAcceptPopup(true);
      setCurrentRowIndex(rowIndex);
    } catch (error) {
      console.error("Error updating acceptance status:", error);
    }
  };

  const handleReject = async () => {
    try {
      const task = data[currentRowIndex];
      await axios.post(`http://localhost:8000/api/users/tasks/${task.id}/reject/`, {
        reason: rejectionReason,
      });
      setRejectedRows((prev) => [...prev, currentRowIndex]);
      setShowRejectModal(false);
      setRejectionReason("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error rejecting task:", error);
    }
  };

  const handleProceedPayment = async (rowIndex) => {
    try {
      const task = data[rowIndex];
      const payload = {
        task_id: task.id,
        domain_name: task.domain_name,
        price_details: chargesData.map((item) => ({
          label: item.label,
          hours: item.hours,
          rate: item.rate,
          price: item.hours * item.rate,
        })),
        total_price: totalPrice,
      };

      await axios.post(`http://localhost:8000/api/users/tasks/${task.id}/payment-done/`, payload);
      setShowSuccess(true);
      setShowAcceptPopup(false);
      setShowProceedButton((prev) => ({ ...prev, [rowIndex]: false }));
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error sending payment details:", error);
    }
  };

  const handleCancelAccept = (rowIndex) => {
    setShowAcceptPopup(false);
    setShowProceedButton((prev) => ({ ...prev, [rowIndex]: true }));
  };

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-max text-sm text-left">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-2">Domain Name</th>
            <th className="px-4 py-2">Workspace Name</th>
            <th className="px-4 py-2">Request Raised Date</th>
            <th className="px-4 py-2">Request</th>
            <th className="px-4 py-2">Scope of service</th>
            <th className="px-4 py-2">Request status</th>
            <th className="px-4 py-2">Charges</th>
            <th className="px-4 py-2">Proceed to Pay/Reject</th>
          </tr>
        </thead>
        <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-red-500">{error}</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">No tasks found.</td>
              </tr>
            ) : (
              data.map((item, idx) => (
            <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-700">{item.domain_name || "N/A"}</td>
              <td className="px-4 py-2 text-gray-700">{item.workspace_name || "N/A"}</td>
              <td className="px-4 py-2 text-gray-700">{new Date(item.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
                onClick={() => { setSelectedTask(item); setShowRequestPopup(true); }}>
                <Eye size={16} /> View Request
              </td>
              <td className="px-4 py-2 text-blue-600 font-bold cursor-pointer"
                onClick={() => { setSelectedTask(item); setShowScopePopup(true); }}>
                View Scope
              </td>
              <td className="px-4 py-2">
                <span className="text-orange-500 text-sm bg-orange-50 px-2 py-1 rounded-full inline-flex items-center gap-1">
                  <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                  {item.status ? item.status.replace(/_/g, " ") : "No status available."}
                </span>
              </td>
              <td className="px-4 py-2 text-blue-600 font-bold cursor-pointer"
                onClick={() => setShowChargesPopup(true)}>
                View Charges
              </td>
              <td className="px-4 py-2">
                {item.client_acceptance_status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm font-medium"
                      onClick={() => handleAccept(idx)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-100 text-red-500 px-3 py-1 rounded-md text-sm font-medium"
                      onClick={() => {
                        setShowRejectModal(true);
                        setCurrentRowIndex(idx);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                ) : item.client_acceptance_status === "accepted" ? (
                  item.payment_status === "done" ? (
                    <span className="text-green-600 font-semibold text-sm">Payment Done</span>
                  ) : (
                    <button
                      className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-sm font-medium"
                      onClick={() => {
                        setCurrentRowIndex(idx);
                        setShowAcceptPopup(true);
                      }}
                    >
                      Proceed to Pay
                    </button>
                  )
                ) : (
                  <span className="text-red-500 text-sm font-medium">Rejected</span>
                )}
              </td>
            </tr>
          ))
        )}
        </tbody>
      </table>

      {/* Modals (Request, Scope, Accept, Reject) and Success Toast */}
      {showRequestPopup && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl relative">
            <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowRequestPopup(false)} />
            <h2 className="text-lg font-semibold mb-2">Request Title</h2>
            <p className="text-gray-700 mb-4">{selectedTask.title}</p>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-600">{selectedTask.description || "No description provided."}</p>
          </div>
        </div>
      )}

      {showScopePopup && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl relative">
            <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowScopePopup(false)} />
            <h2 className="text-lg font-semibold mb-4">Scope of Service</h2>
            <p className="text-sm text-gray-600">Status: <strong>{selectedTask.status ? selectedTask.status.replace(/_/g, " ") : "No status available."}</strong></p>
          </div>
        </div>
      )}

      {showAcceptPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl relative">
            <X className="absolute top-3 right-3 cursor-pointer" onClick={() => handleCancelAccept(currentRowIndex)} />
            <h2 className="text-lg font-semibold mb-4">Proceed to Pay</h2>
            <p className="text-sm text-gray-600 mb-4">Do you want to proceed with the payment for this domain?</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                onClick={() => handleCancelAccept(currentRowIndex)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => handleProceedPayment(currentRowIndex)}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[450px] rounded-xl p-6 shadow-xl relative">
            <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowRejectModal(false)} />
            <h2 className="text-lg font-semibold mb-4">Reason for rejection</h2>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md p-3 text-sm text-gray-700 resize-none placeholder-gray-400"
              placeholder="Reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleReject}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-slideUp">
          Action completed successfully!
        </div>
      )}

      <style>{`
        .animate-slideUp {
          animation: slideUp 0.5s ease forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TableComponent;
