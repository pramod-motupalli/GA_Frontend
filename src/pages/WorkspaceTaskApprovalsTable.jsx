import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Eye, ChevronDown, UserCircle } from 'lucide-react';

const dummyWorkspaceApprovals = [
  { id: 'wta1', taskId: 'b1', requestFrom: 'Jaitej', domainName: 'Sampledomain.com', workspaceName: 'GADOMES', clientRequestId: 'cr1',  status: 'Pending' },
  { id: 'wta2', taskId: 't1', requestFrom: 'Surya', domainName: 'Anotherdomain.net', workspaceName: 'ClientX Project', clientRequestId: 'cr2', status: 'Pending' },
  { id: 'wta3', taskId: 'b2', requestFrom: 'Ameer', domainName: 'Techsolutions.io', workspaceName: 'Internal Tools', clientRequestId: 'cr3',  status: 'Approved' },
  { id: 'wta4', taskId: 'p1', requestFrom: 'Ravi', domainName: 'Webservices.com', workspaceName: 'API Dev', clientRequestId: 'cr4',  status: 'Pending' },
  { id: 'wta5', taskId: 'd1', requestFrom: 'Kiran', domainName: 'Mobileapp.dev', workspaceName: 'UX Design', clientRequestId: 'cr5', status: 'Pending' },
  { id: 'wta6', taskId: 'r1', requestFrom: 'Kumar', domainName: 'Dataanalysis.org', workspaceName: 'Reporting', clientRequestId: 'cr6', status: 'Approved' },
  { id: 'wta7', taskId: 'b3', requestFrom: 'Sunita', domainName: 'Ecommerce.store', workspaceName: 'Storefront V2', clientRequestId: 'cr7', status: 'Pending' },
  { id: 'wta8', taskId: 't2', requestFrom: 'Vikram', domainName: 'Cloudhost.co', workspaceName: 'Infrastructure', clientRequestId: 'cr8',status: 'Pending' },
  { id: 'wta9', taskId: 'p2', requestFrom: 'Anita', domainName: 'Gamezone.com', workspaceName: 'Level Design', clientRequestId: 'cr9', status: 'Approved' },
  { id: 'wta10', taskId: 'd2', requestFrom: 'Mohan', domainName: 'Blogplatform.net', workspaceName: 'Content Hub', clientRequestId: 'cr10', status: 'Pending' },
  { id: 'wta11', taskId: 'r2', requestFrom: 'Deepa', domainName: 'Learning.edu', workspaceName: 'Course Creator', clientRequestId: 'cr11',status: 'Pending' },
];

const WorkspaceTaskApprovalsTable = ({ onViewTask, onViewClientRequest, staffMembers, onAssignTask }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Or a smaller number like 5 for testing

  const [assignments, setAssignments] = useState(() => {
    const initialAssignments = {};
    dummyWorkspaceApprovals.forEach(item => {
      initialAssignments[item.id] = item.assignedToId || ''; 
    });
    return initialAssignments;
  });

  const handleAssignMember = (approvalId, staffId) => {
    setAssignments(prev => ({ ...prev, [approvalId]: staffId }));
    if (onAssignTask) {
        onAssignTask(approvalId, staffId); 
    }
    console.log(`Assigned staff ${staffId} to approval ${approvalId}`);
  };


  const filteredApprovals = dummyWorkspaceApprovals.filter(item =>
    item.requestFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.workspaceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage) || 1;
  const paginatedApprovals = filteredApprovals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const getPageNumbers = () => {
    const pageCount = totalPages; const current = currentPage; const delta = 1; const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(pageCount - 1, current + delta); i++) range.push(i);
    if (current - delta > 2) range.unshift("...");
    if (current + delta < pageCount - 1) range.push("...");
    range.unshift(1); if (pageCount > 1 && !range.includes(pageCount)) range.push(pageCount);
    return [...new Set(range)]; // Ensure uniqueness if pageCount is small
  };
  const pageNumbers = getPageNumbers();


  const handleApprove = (itemId) => {
    console.log("Approved item:", itemId);
    alert(`Item ${itemId} marked as Approved (locally).`);
    
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:flex-grow">
          <input
            type="text"
            placeholder="Search by request, domain, workspace..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
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
        <table className="min-w-full w-full table-auto">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Request from</th>
              <th className="px-4 py-3">Domain name</th>
              <th className="px-4 py-3">Workspace Name</th>
              
              <th className="px-4 py-3">View Task</th> {/* Moved for clarity */}
              <th className="px-4 py-3">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedApprovals.length > 0 ? paginatedApprovals.map(item => (
              <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{item.requestFrom}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.domainName}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.workspaceName}</td>
                
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => onViewTask(item.taskId)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-xs px-2 py-1 rounded border border-blue-500 hover:bg-blue-50"
                  >
                    <Eye size={14} className="mr-1" /> View Task
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={item.status === 'Approved'}
                    className={`text-xs px-3 py-1.5 rounded
                                ${item.status === 'Approved'
                                    ? 'bg-green-500 text-white cursor-not-allowed opacity-70'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    {item.status === 'Approved' ? 'Approved' : 'Approve'}
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">No workspace task approvals found.</td>
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
    </div>
  );
};

export default WorkspaceTaskApprovalsTable;