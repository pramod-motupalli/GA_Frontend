import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, X, Pencil, PaintRoller } from 'lucide-react';

export default function RequestTable() {
  const [popupType, setPopupType] = useState(null);
  const [hours, setHours] = useState({ design: 0, content: 0, dev: 0 });
  const [requestRaised, setRequestRaised] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get('http://localhost:8000/api/users/tasks/out-of-scope/')
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Failed to fetch tasks', err));
  };

  const scopeData = [
    { icon: <PaintRoller className="w-4 h-4 text-gray-400" />, label: 'For Designing', field: 'design', rate: 200 },
    { icon: <Pencil className="w-4 h-4 text-gray-400" />, label: 'Content Writing', field: 'content', rate: 250 },
    { icon: <Pencil className="w-4 h-4 text-gray-400" />, label: 'For Development', field: 'dev', rate: 300 },
  ];

  const totalHours = Object.values(hours).reduce((sum, h) => sum + Number(h), 0);
  const totalPrice = hours.design * 200 + hours.content * 250 + hours.dev * 300;

  const handleRaiseRequest = () => {
    if (selectedItem) {
      axios
        .post(`http://localhost:8000/api/users/tasks/raise-request/${selectedItem.id}/`)
        .then(() => {
          setRequestRaised(true);
          fetchTasks(); // Refresh task list
          setTimeout(() => setRequestRaised(false), 2000);
          setPopupType(null);
        })
        .catch((err) => console.error("Failed to raise request", err));
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto p-6 bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Request from</th>
              <th className="px-4 py-3">Workspace Name</th>
              <th className="px-4 py-3">Client Name</th>
              <th className="px-4 py-3">Domain Name</th>
              <th className="px-4 py-3">Request Raised Date</th>
              <th className="px-4 py-3">Client Request</th>
              <th className="px-4 py-3">Scope of service</th>
              <th className="px-4 py-3">Updated work Time</th>
              <th className="px-4 py-3">Request to Client</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{task.assigned_to_username}</td>
                <td className="px-4 py-3">{task.client_name}</td>
                <td className="px-4 py-3">{task.workspace_name}</td>
                <td className="px-4 py-3">{task.domain_name || 'N/A'}</td>
                <td className="px-4 py-3">{new Date(task.created_at).toLocaleDateString()}</td>
                <td
                  className="px-4 py-3 text-blue-600 cursor-pointer flex items-center gap-1"
                  onClick={() => {
                    setSelectedItem(task);
                    setPopupType('view-request');
                  }}
                >
                  <Eye className="w-4 h-4 text-blue-500" /> View Request
                </td>
                <td
                  className="px-4 py-3 text-blue-600 cursor-pointer"
                  onClick={() => {
                    setSelectedItem(task);
                    setPopupType('view-scope');
                  }}
                >
                  View Scope
                </td>
                <td
                  className="px-4 py-3 text-blue-600 cursor-pointer"
                  onClick={() => {
                    setPopupType('working-hours');
                    setIsEditable(false);
                    setSelectedItem(task);
                    setHours({ design: 0, content: 0, dev: 0 });
                  }}
                >
                  Working hours
                </td>
                <td className="px-4 py-3">
                  {task.raised_to_client ? (
                    <span className="text-green-600 font-medium">Raised</span>
                  ) : (
                    <button
                      className="bg-[#2e66e5] hover:bg-[#3b5fc3] text-white text-xs font-medium py-2 px-4 rounded-md"
                      onClick={() => {
                        axios
                          .post(`http://localhost:8000/api/users/tasks/raise-request/${task.id}/`)
                          .then(() => {
                            setRequestRaised(true);
                            fetchTasks();
                            setTimeout(() => setRequestRaised(false), 2000);
                          })
                          .catch((err) => console.error("Failed to raise request", err));
                      }}
                    >
                      Raise Request
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupType && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl relative animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {popupType === 'working-hours'
                  ? 'Edit Scope Hours'
                  : popupType === 'view-request'
                  ? 'Client Request'
                  : 'Scope Status'}
              </h2>
              <X className="cursor-pointer" onClick={() => setPopupType(null)} />
            </div>

            {popupType === 'working-hours' ? (
              <div className="space-y-3">
                {scopeData.map(({ icon, label, field, rate }) => (
                  <div key={field} className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2 w-[160px]">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <input
                      type="number"
                      className="border px-2 py-1 w-[60px] rounded-md"
                      value={hours[field]}
                      readOnly={!isEditable}
                      onChange={(e) => setHours({ ...hours, [field]: e.target.value })}
                    />
                    <div className="text-right w-[80px] text-gray-700">₹{Number(hours[field]) * rate}</div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span>
                    {totalHours} HRS - ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  {!isEditable ? (
                    <>
                      <button
                        className="px-4 py-1 text-sm rounded-md border border-gray-400 hover:bg-gray-100"
                        onClick={handleRaiseRequest}
                      >
                        Ok
                      </button>
                      <button
                        className="px-4 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => setIsEditable(true)}
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-4 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                      onClick={() => {
                        setIsEditable(false);
                        setPopupType(null);
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            ) : popupType === 'view-request' ? (
              <div>
                <h3 className="text-md font-medium mb-2 text-gray-800">Title:</h3>
                <p className="text-gray-700 mb-4">{selectedItem.title || 'No title provided'}</p>
                <h3 className="text-md font-medium mb-2 text-gray-800">Description:</h3>
                <p className="text-gray-600">{selectedItem.description || 'No description provided'}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium mb-2 text-gray-800">Scope Status:</h3>
                <p className="text-gray-700">{selectedItem.status ? selectedItem.status.replace(/_/g, " ") : "No status available."}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {requestRaised && (
        <div className="fixed bottom-6 right-6 bg-white text-green-700 px-6 py-3 rounded-xl shadow-lg border border-green-400 animate-slide-up-fade">
          Request successfully raised!
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes slide-up-fade {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up-fade {
          animation: slide-up-fade 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
