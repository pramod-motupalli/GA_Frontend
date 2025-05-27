import React, { useState } from 'react';

const initialMember = { person: '', priority: '', date: '' };

const AssignMembersModal = ({ isOpen, onClose }) => {
  const [members, setMembers] = useState([initialMember]);

  const handleChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([...members, initialMember]);
  };

  const handleCreateTask = () => {
    console.log('Assigned Members:', members);
    onClose(); // Close modal after submission
  };

  const personOptions = ['Arjun', 'Ameer', 'Priya', 'John'];
  const priorityOptions = ['Low', 'Medium', 'High'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Assign members</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
        </div>

        {members.map((member, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <select
              value={member.person}
              onChange={(e) => handleChange(index, 'person', e.target.value)}
              className="border p-2 rounded w-1/3"
            >
              <option value="">Select Member</option>
              {personOptions.map((person) => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>

            <select
              value={member.priority}
              onChange={(e) => handleChange(index, 'priority', e.target.value)}
              className="border p-2 rounded w-1/3"
            >
              <option value="">Work Priority</option>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>

            <input
              type="date"
              value={member.date}
              onChange={(e) => handleChange(index, 'date', e.target.value)}
              className="border p-2 rounded w-1/3"
            />
          </div>
        ))}

        <button
          onClick={addMember}
          className="text-blue-600 hover:underline mb-4"
        >
          + Add member
        </button>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-gray-600"
          >
            cancel
          </button>
          <button
            onClick={handleCreateTask}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignMembersModal;
