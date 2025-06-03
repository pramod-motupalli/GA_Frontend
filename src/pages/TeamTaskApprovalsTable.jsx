import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Eye, ChevronDown, UserCircle, AlertTriangle, X } from 'lucide-react';
const dummyTeamApprovals = [
{ id: 'tta1', domainName: 'Sampledomain.com', workspace: 'Sampledomain.com', clientRequest: 'Req ID 123', managerApproval: 'Pending', reason: null, assignedToId: null, deadline: '04-05-2025', summaryLink: '#' },
{ id: 'tta2', domainName: 'Sampledomain.com', workspace: 'Sampledomain.com', clientRequest: 'Req ID 124', managerApproval: 'Approved', reason: null, assignedToId: null, deadline: '10-05-2025', summaryLink: '#' },
{ id: 'tta3', domainName: 'Otherdomain.net', workspace: 'Project X', clientRequest: 'Req ID 125', managerApproval: 'Escalate', reason: 'Client budget exceeded initial scope significantly.', assignedToId: null, deadline: '15-05-2025', summaryLink: '#' },
{ id: 'tta4', domainName: 'Webservices.com', workspace: 'API Dev', clientRequest: 'Req ID 126', managerApproval: 'Pending', reason: null, assignedToId: null, deadline: '20-05-2025', summaryLink: '#' },
{ id: 'tta5', domainName: 'Mobileapp.dev', workspace: 'UX Design', clientRequest: 'Req ID 127', managerApproval: 'Approved', reason: null, assignedToId: null, deadline: '22-05-2025', summaryLink: '#' },
{ id: 'tta6', domainName: 'Dataanalysis.org', workspace: 'Reporting', clientRequest: 'Req ID 128', managerApproval: 'Pending', reason: null, assignedToId: null, deadline: '25-05-2025', summaryLink: '#' },
{ id: 'tta7', domainName: 'Ecommerce.store', workspace: 'Storefront V2', clientRequest: 'Req ID 129', managerApproval: 'Escalate', reason: 'Technical feasibility concerns.', assignedToId: 'staff1', deadline: '28-05-2025', summaryLink: '#' },
{ id: 'tta8', domainName: 'Cloudhost.co', workspace: 'Infrastructure', clientRequest: 'Req ID 130', managerApproval: 'Pending', reason: null, assignedToId: null, deadline: '01-06-2025', summaryLink: '#' },
{ id: 'tta9', domainName: 'Gamezone.com', workspace: 'Level Design', clientRequest: 'Req ID 131', managerApproval: 'Approved', reason: null, assignedToId: null, deadline: '03-06-2025', summaryLink: '#' },
{ id: 'tta10', domainName: 'Blogplatform.net', workspace: 'Content Hub', clientRequest: 'Req ID 132', managerApproval: 'Pending', reason: null, assignedToId: null, deadline: '05-06-2025', summaryLink: '#' },
{ id: 'tta11', domainName: 'Learning.edu', workspace: 'Course Creator', clientRequest: 'Req ID 133', managerApproval: 'Pending', reason: null, assignedToId: null, deadline: '08-06-2025', summaryLink: '#' },
];
const TeamTaskApprovalsTable = ({ staffMembers, onAssignTask }) => {
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; //
const [showReasonModal, setShowReasonModal] = useState(false);
const [selectedReason, setSelectedReason] = useState('');
const [assignments, setAssignments] = useState(() => {
const initialAssignments = {};
dummyTeamApprovals.forEach(item => {
initialAssignments[item.id] = item.assignedToId || '';
});
return initialAssignments;
});
const handleAssignMember = (approvalId, staffId) => {
setAssignments(prev => ({ ...prev, [approvalId]: staffId }));
if (onAssignTask) {
onAssignTask(approvalId, staffId);
}
console.log('Assigned staff ${staffId} to team approval ${approvalId}');
};
const filteredApprovals = dummyTeamApprovals.filter(item =>
item.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.workspace.toLowerCase().includes(searchTerm.toLowerCase())
);
const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage) || 1;
const paginatedApprovals = filteredApprovals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
const getPageNumbers = () => {
const pageCount = totalPages; const current = currentPage; const delta = 1; const range = [];
for (let i = Math.max(2, current - delta); i <= Math.min(pageCount - 1, current + delta); i++) range.push(i);
if (current - delta > 2) range.unshift("...");
if (current + delta < pageCount - 1) range.push("...");
range.unshift(1); if (pageCount > 1 && !range.includes(pageCount)) range.push(pageCount);
return [...new Set(range)];
};
const pageNumbers = getPageNumbers();
const getStatusClass = (status) => {
if (!status) return 'bg-gray-100 text-gray-700';
switch (status.toLowerCase()) {
case 'approved': return 'bg-green-100 text-green-700';
case 'pending': return 'bg-yellow-100 text-yellow-700';
case 'escalate': return 'bg-red-100 text-red-700';
default: return 'bg-gray-100 text-gray-700';
}
};
const handleViewReason = (reason) => {
setSelectedReason(reason);
setShowReasonModal(true);
};
return (
<div className="bg-white p-6 rounded-xl shadow">
<div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
<div className="relative w-full md:flex-grow">
<input type="text" placeholder="Search by domain, workspace..."
className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
</div>
<div className="flex items-center gap-3 flex-shrink-0">
<button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none text-sm">
Sort by <ChevronDown size={16} />
</button>
<button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none text-sm">
Filters <Filter className="w-4 h-4" />
</button>
<button className="p-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
<MoreHorizontal className="w-5 h-5" />
</button>
</div>
</div>
<div className="overflow-x-auto rounded-lg border">
    <table className="min-w-[1200px] w-full table-auto">
      <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <tr>
          <th className="px-4 py-3">Domain Name</th>
          <th className="px-4 py-3">Workspace</th>
          <th className="px-4 py-3">Client Request</th>
          <th className="px-4 py-3">Manager Approval</th>
          <th className="px-4 py-3">Reason</th>
          <th className="px-4 py-3">Assigned to</th>
          <th className="px-4 py-3">Deadline to member</th>
          <th className="px-4 py-3">Summary</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {paginatedApprovals.length > 0 ? paginatedApprovals.map(item => (
          <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">{item.domainName}</td>
            <td className="px-4 py-3 whitespace-nowrap">{item.workspace}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <button className="flex items-center text-blue-600 hover:text-blue-700">
                <Eye size={14} className="mr-1" /> View Request {/* Placeholder action */}
              </button>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.managerApproval)}`}>
                {item.managerApproval}
              </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {item.managerApproval && item.managerApproval.toLowerCase() === 'escalate' && item.reason ? (
                <button onClick={() => handleViewReason(item.reason)} className="flex items-center text-blue-600 hover:text-blue-700">
                  <Eye size={14} className="mr-1" /> View Reason
                </button>
              ) : ( '-' )}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
               <select
                    value={assignments[item.id] || ''}
                    onChange={(e) => handleAssignMember(item.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full max-w-[150px]"
                     
                >
                    <option value="">Select</option>
                    {staffMembers && staffMembers.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))}
                </select>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">{item.deadline}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <button className="bg-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded hover:bg-blue-200">
                summary
              </button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="8" className="text-center py-10 text-gray-500">No team task approvals found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
  {/* Pagination UI */}
  {filteredApprovals.length > itemsPerPage && (
    <div className="flex items-center justify-between mt-6 px-1 text-sm text-gray-600">
      <div>
        Page{" "}
        <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
          {Array.from({ length: totalPages }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
        </select> {" "}of {totalPages}
      </div>
      <div className="flex items-center space-x-1">
        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
          className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 ${currentPage === page ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : ''}`}>{page}</button>
            ) : (<span className="px-3 py-1.5">{page}</span>)}
          </React.Fragment>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
          className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  )}

    {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Escalation Reason</h3>
                    <button onClick={() => setShowReasonModal(true)} className="text-gray-500 hover:text-gray-700"> <X size={20} /> </button>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedReason}</p>
                <div className="mt-6 text-right">
                    <button onClick={() => setShowReasonModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">Close</button>
                </div>
            </div>
        </div>
    )}
</div>
);
};
export default TeamTaskApprovalsTable;