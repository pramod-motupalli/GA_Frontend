
import React, { useState, useEffect } from "react"; 

function ConfigureStepModal({ isOpen, onClose, onSubmit, staffList, initialData }) {
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAssignedTo(initialData?.assignedTo || "");
      setPriority(initialData?.priority || "");
      setDeadline(initialData?.deadline || "");
    }
  }, [initialData, isOpen]);

  const handleSubmitLocal = () => {
    onSubmit({
      assignedTo,
      priority,
      deadline,
    });
    // onClose(); // onSubmit in FlowManager will close this
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black bg-opacity-50">
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Configure Step Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Member</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Member</option>
              {staffList.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-8">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitLocal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
}

function FlowManager({ isOpen, onClose, staffList }) { // Added staffList prop
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [flowSteps, setFlowSteps] = useState([]);
  
  const [isConfigureStepModalOpen, setIsConfigureStepModalOpen] = useState(false);
  const [configuringStepIndex, setConfiguringStepIndex] = useState(null);

  useEffect(() => {
    if (isOpen && flowSteps.length === 0) {
      // Initialize with one empty step when modal opens
      setFlowSteps([{ 
        id: Date.now(), 
        description: "", 
        assignedTo: null, 
        priority: "", 
        deadline: "", 
        hours: 0 
      }]);
    } else if (!isOpen) {
      // Reset when main modal is closed (optional, parent might want to keep state)
      // setFlowSteps([]); 
    }
  }, [isOpen]); // Removed flowSteps.length from dependency to avoid re-init if user deletes all steps

  const handleAddFlow = () => {
    setFlowSteps([
      ...flowSteps, 
      { 
        id: Date.now(), 
        description: "", 
        assignedTo: null, 
        priority: "", 
        deadline: "", 
        hours: 0 
      }
    ]);
  };

  const handleFlowDescriptionChange = (index, value) => {
    const updatedSteps = [...flowSteps];
    updatedSteps[index].description = value;
    setFlowSteps(updatedSteps);
  };
  
  const handleRemoveFlowStep = (index) => {
    const updatedSteps = flowSteps.filter((_, i) => i !== index);
    setFlowSteps(updatedSteps);
  };

  const handleOpenHoursModal = () => {
    // You might want to add validation here, e.g., all steps must have descriptions
    setShowHoursModal(true);
  };

  const handleHourChange = (index, value) => {
    const updatedSteps = [...flowSteps];
    const newHours = parseFloat(value);
    updatedSteps[index].hours = isNaN(newHours) || newHours < 0 ? 0 : newHours;
    setFlowSteps(updatedSteps);
  };

  const handleOpenConfigureStepModal = (index) => {
    setConfiguringStepIndex(index);
    setIsConfigureStepModalOpen(true);
  };

  const handleConfigureStepSubmit = (stepDetails) => { // stepDetails = { assignedTo, priority, deadline }
    if (configuringStepIndex !== null) {
      const updatedSteps = [...flowSteps];
      updatedSteps[configuringStepIndex] = {
        ...updatedSteps[configuringStepIndex],
        ...stepDetails
      };
      setFlowSteps(updatedSteps);
    }
    setIsConfigureStepModalOpen(false);
    setConfiguringStepIndex(null);
  };

  const handleSaveFlowAndClose = () => {
      console.log("Final Flow Steps to be saved:", flowSteps);
      // Here, you would typically pass flowSteps data back to the parent component
      // e.g., if onClose can take arguments: onClose(flowSteps);
      // or via a dedicated onSave prop: onSave(flowSteps);
      onClose(); // Close the main FlowManager modal
      // Optionally reset state for next opening
      // setFlowSteps([]); 
      // setShowHoursModal(false); // already closed by its own button
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white w-[550px] p-6 rounded-lg shadow-xl"> {/* Wider for more content */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Work Flow</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
              {flowSteps.map((step, idx) => (
                <div key={step.id} className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50">
                  <div className="flex items-center justify-between">
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Step ${idx + 1} Description`}
                      value={step.description}
                      onChange={(e) => handleFlowDescriptionChange(idx, e.target.value)}
                    />
                    {flowSteps.length > 1 && (
                         <button 
                            onClick={() => handleRemoveFlowStep(idx)} 
                            className="ml-2 text-red-500 hover:text-red-700 p-1"
                            title="Remove Step"
                        >
                           × {/* A simple X for remove */}
                        </button>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-600 space-y-1 pl-1">
                    {step.assignedTo && staffList && (
                        <p><strong>Assigned to:</strong> {staffList.find(s => s.id === step.assignedTo)?.name || 'N/A'}</p>
                    )}
                    {step.priority && <p><strong>Priority:</strong> {step.priority}</p>}
                    {step.deadline && <p><strong>Deadline:</strong> {new Date(step.deadline + 'T00:00:00').toLocaleDateString()}</p>} 
                                        {/* Ensure deadline is formatted nicely, handling potential timezone issues if it's just YYYY-MM-DD */}
                  </div>
                  <button
                    onClick={() => handleOpenConfigureStepModal(idx)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {step.assignedTo || step.priority || step.deadline ? 'Edit Details' : 'Configure Details'}
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddFlow}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium py-2 px-1 rounded-md flex items-center"
              >
                <span className="text-xl mr-1">+</span> add to flow
              </button>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={onClose} 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOpenHoursModal}
                disabled={flowSteps.some(step => !step.description.trim())} // Disable if any step description is empty
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set Hours & Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scope of Hours Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[55] bg-black bg-opacity-40">
          <div className="bg-white w-[450px] p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Scope of Hours</h2>
              <button onClick={() => setShowHoursModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full mb-4 text-sm">
                <thead className="bg-gray-100">
                    <tr className="text-left">
                    <th className="py-2 px-3 font-medium text-gray-600">Category / Step</th>
                    <th className="py-2 px-3 font-medium text-gray-600">Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {flowSteps.map((step, idx) => (
                    <tr key={step.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700">{step.description || `Step ${idx + 1}`}</td>
                        <td className="py-2 px-3">
                        <input
                            type="number"
                            value={step.hours}
                            onChange={(e) => handleHourChange(idx, e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                    setShowHoursModal(false);
                    handleSaveFlowAndClose(); // Final save action
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Step Modal (instance) */}
      {configuringStepIndex !== null && (
         <ConfigureStepModal
            isOpen={isConfigureStepModalOpen}
            onClose={() => {
                setIsConfigureStepModalOpen(false);
                setConfiguringStepIndex(null);
            }}
            onSubmit={handleConfigureStepSubmit}
            staffList={staffList || []}
            initialData={flowSteps[configuringStepIndex]}
        />
      )}
    </>
  );
}

export default FlowManager; // If FlowManager is in its own file