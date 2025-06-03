import React, { useState } from "react";
import { Eye, X } from "lucide-react";

const data = new Array(15).fill({
  domain: "Sampledomain.com",
  date: "04-05-2025",
  request: "View Request",
  scope: "View Scope",
  status: "out of scope",
  charges: "View Charges",
});

const TableComponent = () => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChargesPopup, setShowChargesPopup] = useState(false);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [showScopePopup, setShowScopePopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);

  const handleSend = () => {
    setShowRejectModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const chargesData = [
    { label: "For Designing", hours: 1, rate: 10000 },
    { label: "Content Writing", hours: 1, rate: 20000 },
    { label: "For Development", hours: 1, rate: 30000 },
  ];

  const totalPrice = chargesData.reduce(
    (sum, item) => sum + item.hours * item.rate,
    0
  );

  return (
    <div className="p-4 overflow-x-auto relative">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-2">Domain Name</th>
            <th className="px-4 py-2">Request Raised Date</th>
            <th className="px-4 py-2">Request</th>
            <th className="px-4 py-2">Scope of service</th>
            <th className="px-4 py-2">Request status</th>
            <th className="px-4 py-2">Charges per hourly bases</th>
            <th className="px-4 py-2">Proceed to pay/ Reject</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-700">{item.domain}</td>
              <td className="px-4 py-2 text-gray-700">{item.date}</td>
              <td
                className="px-4 py-2 text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
                onClick={() => setShowRequestPopup(true)}
              >
                <Eye size={16} /> <span>{item.request}</span>
              </td>
              <td
                className="px-4 py-2 text-blue-600 font-bold cursor-pointer"
                onClick={() => setShowScopePopup(true)}
              >
                {item.scope}
              </td>
              <td className="px-4 py-2">
                <span className="text-orange-500 text-sm bg-orange-50 px-2 py-1 rounded-full inline-flex items-center gap-1">
                  <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                  {item.status}
                </span>
              </td>
              <td
                className="px-4 py-2 text-blue-600 font-bold cursor-pointer"
                onClick={() => setShowChargesPopup(true)}
              >
                {item.charges}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm font-medium"
                    onClick={() => setShowAcceptPopup(true)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-100 text-red-500 px-3 py-1 rounded-md text-sm font-medium"
                    onClick={() => setShowRejectModal(true)}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[450px] rounded-xl p-6 shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowRejectModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Reason for rejection
            </h2>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md p-3 text-sm text-gray-700 resize-none placeholder-gray-400"
              placeholder="Reason for rejection"
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Charges Modal */}
      {showChargesPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Scope of Hours</h2>
              <X className="cursor-pointer" onClick={() => setShowChargesPopup(false)} />
            </div>
            <div className="space-y-3">
              {chargesData.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center text-sm ${
                    index === chargesData.length - 1
                      ? "border-t pt-3 mt-2 font-semibold text-gray-700"
                      : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-2 w-[180px]">
                    <span>{item.label}</span>
                  </div>
                  <div className="text-right w-[60px] text-gray-400">{item.hours} HRS</div>
                  <div className="text-right w-[60px] text-gray-700">₹{item.hours * item.rate}</div>
                </div>
              ))}
              <div className="flex justify-between items-center text-sm border-t pt-3 mt-2 font-semibold text-gray-700">
                <div className="w-[180px]">Total hours - Price</div>
                <div className="w-[60px] text-right">{chargesData.reduce((a, b) => a + b.hours, 0)} HRS</div>
                <div className="w-[60px] text-right">₹{totalPrice}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder Modals */}
      {showRequestPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl relative animate-fadeIn">
            <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowRequestPopup(false)} />
            <h2 className="text-lg font-semibold mb-4">Request Details</h2>
            <p className="text-sm text-gray-600">This is a placeholder for View Request modal content.</p>
          </div>
        </div>
      )}

      {showScopePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl relative animate-fadeIn">
            <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowScopePopup(false)} />
            <h2 className="text-lg font-semibold mb-4">Scope of Service</h2>
            <p className="text-sm text-gray-600">This is a placeholder for View Scope modal content.</p>
          </div>
        </div>
      )}

      {showAcceptPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl relative animate-fadeIn">
            <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowAcceptPopup(false)} />
            <h2 className="text-lg font-semibold mb-4">Proceed to Pay</h2>
            <p className="text-sm text-gray-600">Payment processing placeholder - full integration coming soon.</p>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-slideUp">
          Rejection reason sent successfully!
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
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
