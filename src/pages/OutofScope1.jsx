import React, { useState } from "react";
import { Eye, X } from "lucide-react";

const data = Array.from({ length: 14 }, (_, i) => ({
  clientName: "Elon Musk",
  domainName: "Sampledomain.com",
  requestDate: "04-05-2025",
  approvalStatus: i % 2 === 0 ? "Accepted" : "Reject",
  reason: i % 2 === 0 ? "-" : "View Reason",
  paymentStatus: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Un available" : "Pending",
  riseToSCOP: i % 3 === 0,
}));

export default function ClientRequestTable() {
  const [modalContent, setModalContent] = useState(null);

  const closeModal = () => setModalContent(null);

  return (
    <div className="overflow-auto rounded-lg border border-gray-200 relative">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700 text-left">
            <th className="px-4 py-2 font-semibold">Client Name</th>
            <th className="px-4 py-2 font-semibold">Domain Name</th>
            <th className="px-4 py-2 font-semibold">Request Raised Date</th>
            <th className="px-4 py-2 font-semibold">Client Request</th>
            <th className="px-4 py-2 font-semibold">Scope of service</th>
            <th className="px-4 py-2 font-semibold">Approval Status</th>
            <th className="px-4 py-2 font-semibold">Reason</th>
            <th className="px-4 py-2 font-semibold">Payment Status</th>
            <th className="px-4 py-2 font-semibold">Rise to SCOP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={index} className="whitespace-nowrap text-gray-700">
              <td className="px-4 py-2">{item.clientName}</td>
              <td className="px-4 py-2">{item.domainName}</td>
              <td className="px-4 py-2">{item.requestDate}</td>
              <td className="px-4 py-2 text-blue-600 font-medium flex items-center gap-1 cursor-pointer" onClick={() => setModalContent("Request")}> <Eye size={16} /> View Request </td>
              <td className="px-4 py-2 text-blue-600 font-bold cursor-pointer" onClick={() => setModalContent("Scope")}>View Scope</td>
              <td className="px-4 py-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${item.approvalStatus === "Accepted" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                  <span className="h-2 w-2 rounded-full bg-current"></span>
                  {item.approvalStatus}
                </span>
              </td>
              <td className="px-4 py-2">
                {item.reason === "-" ? (
                  <span>-</span>
                ) : (
                  <span className="text-blue-600 font-medium flex items-center gap-1 cursor-pointer" onClick={() => setModalContent("Reason")}> <Eye size={16} /> {item.reason} </span>
                )}
              </td>
              <td className="px-4 py-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${item.paymentStatus === "Completed" ? "bg-green-100 text-green-600" : item.paymentStatus === "Un available" ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-600"}`}>
                  <span className="h-2 w-2 rounded-full bg-current"></span>
                  {item.paymentStatus}
                </span>
              </td>
              <td className="px-5 py-2">
                <div className="button-wrapper">
                  <button
                    className="w-[110px] h-[32px] text-Inter rounded-md"
                    style={{
                      backgroundColor: item.riseToSCOP ? "#397ecd" : "#c1d0e1",
                      color: "#f9fafc",
                      cursor: "pointer",
                    }}
                    onClick={() => setModalContent(item.riseToSCOP ? "SCOP" : "Alert")}
                  >
                    {item.riseToSCOP ? "Rise to SCOP" : "Rise alert"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[450px] rounded-xl p-6 shadow-xl relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {modalContent === "Request" && "Client Request"}
              {modalContent === "Scope" && "Scope of Work"}
              {modalContent === "Reason" && "Rejection Reason"}
              {modalContent === "SCOP" && "SCOP Action"}
              {modalContent === "Alert" && "Alert Info"}
            </h2>
            <p className="text-sm text-gray-700">
              {modalContent === "Request" && "This is a sample client request popup text."}
              {modalContent === "Scope" && (Math.random() > 0.5 ? "This is within the scope." : "This is out of scope.")}
              {modalContent === "Reason" && "Client's request was rejected due to insufficient information provided."}
              {modalContent === "SCOP" && "Request has been escalated to SCOP successfully."}
              {modalContent === "Alert" && "This request is not eligible for SCOP escalation."}
            </p>
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