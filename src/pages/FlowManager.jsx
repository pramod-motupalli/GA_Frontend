import React, { useState, useEffect } from 'react';
// import { Plus, CalendarDays } from 'lucide-react'; // Uncomment if you use these icons

function FlowManager({
  isOpen,
  onClose,
  onSubmitFlowData,
  initialFlowStepsFromDashboard = [],
  initialHoursFromDashboard = [],
  startModeFromDashboard = 'steps'
}) {
  // STATE AND HANDLERS ARE INSIDE THE COMPONENT
  const [currentView, setCurrentView] = useState('steps');
  const [flowSteps, setFlowSteps] = useState([]);
  const [hours, setHours] = useState([]);

  useEffect(() => {
    console.log("[FlowManager] useEffect. isOpen:", isOpen, "startMode:", startModeFromDashboard);
    if (isOpen) {
      const stepsToUse = initialFlowStepsFromDashboard && initialFlowStepsFromDashboard.length > 0
        ? [...initialFlowStepsFromDashboard]
        : [""];

      let hoursToUse;
      if (initialHoursFromDashboard && initialHoursFromDashboard.length === stepsToUse.length) {
        hoursToUse = [...initialHoursFromDashboard];
      } else {
        hoursToUse = stepsToUse.map(() => 0);
      }

      setFlowSteps(stepsToUse);
      setHours(hoursToUse);

      if (startModeFromDashboard === 'hours' && stepsToUse.length > 0 && stepsToUse.some(step => step && step.trim() !== "")) {
        console.log("[FlowManager] Setting currentView to 'hours'");
        setCurrentView('hours');
      } else {
        console.log("[FlowManager] Setting currentView to 'steps'");
        setCurrentView('steps');
      }
    }
  // THIS IS THE END OF THE useEffect HOOK
  }, [isOpen, startModeFromDashboard, initialFlowStepsFromDashboard, initialHoursFromDashboard]);


  // HANDLER FUNCTIONS ARE NOW CORRECTLY INSIDE FlowManager
  const handleAddFlowStep = () => {
    setFlowSteps(prevSteps => [...prevSteps, ""]);
    setHours(prevHours => [...prevHours, 0]);
  };

  const handleFlowStepChange = (index, value) => {
    const updatedSteps = [...flowSteps];
    updatedSteps[index] = value;
    setFlowSteps(updatedSteps);
  };

  const handleHourChange = (index, value) => {
    const numericValue = parseInt(value, 10);
    const updatedHours = [...hours];
    updatedHours[index] = isNaN(numericValue) || numericValue < 0 ? 0 : numericValue;
    setHours(updatedHours);
  };

  const handleProceedToHours = () => {
    const validSteps = flowSteps.filter(step => step && step.trim() !== "");
    if (validSteps.length === 0) {
      alert("Please define at least one flow step.");
      return;
    }

    if (validSteps.length < flowSteps.length) {
      alert("Empty flow steps have been removed.");
      const newHours = validSteps.map((step) => {
        const originalIndex = flowSteps.findIndex(s => s === step);
        return (originalIndex !== -1 && hours[originalIndex] !== undefined) ? hours[originalIndex] : 0;
      });
      setFlowSteps(validSteps);
      setHours(newHours);
    } else {
      if (hours.length !== validSteps.length) {
        setHours(validSteps.map(() => 0));
      }
    }
    setCurrentView('hours');
  };

  const handleConfirmHours = () => {
    onSubmitFlowData(flowSteps, hours);
  };

  // JSX RETURN AND CONDITIONAL RENDERING
  if (!isOpen) {
    console.log("[FlowManager] isOpen is false, returning null");
    return null;
  }
  console.log("[FlowManager] Rendering. currentView:", currentView);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {currentView === 'steps' && (
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Work Flow</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2">
            {flowSteps.map((step, idx) => (
              <input
                key={idx}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder={`Step ${idx + 1}`}
                value={step}
                onChange={(e) => handleFlowStepChange(idx, e.target.value)}
              />
            ))}
            <button
              onClick={handleAddFlowStep}
              className="text-blue-600 hover:text-blue-700 text-sm underline mt-2"
            >
              {/* If using Plus icon: <Plus className="w-4 h-4 mr-1" /> */}
              + add to flow
            </button>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button onClick={onClose} className="border px-4 py-2 rounded text-sm text-gray-700 hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleProceedToHours}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
            >
              Next: Define Hours
            </button>
          </div>
        </div>
      )}

      {currentView === 'hours' && (
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Scope of Hours</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {flowSteps.length > 0 ? (
              <table className="w-full mb-4 text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 font-semibold">Category</th>
                    <th className="py-2 font-semibold text-right pr-2">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {flowSteps.map((step, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{step}</td>
                      <td className="py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          value={hours[idx] === undefined ? '' : hours[idx]}
                          onChange={(e) => handleHourChange(idx, e.target.value)}
                          className="w-20 border rounded px-2 py-1 text-right"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No flow steps defined.</p>
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentView('steps')}
              className="text-sm text-blue-600 hover:underline"
            >
               Back to Steps
            </button>
            <button
              onClick={handleConfirmHours}
              className="bg-blue-500 text-white px-6 py-2 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
              disabled={flowSteps.length === 0}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
// THIS IS THE END OF THE FlowManager FUNCTION COMPONENT'S RETURN STATEMENT
}
// THIS IS THE END OF THE FlowManager FUNCTION COMPONENT ITSELF

export default FlowManager;