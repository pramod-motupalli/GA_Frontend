import React from "react";

function TeamLead() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Team Lead Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Welcome to the Team Lead panel. Here you can manage staff, view tasks, and oversee project progress.
      </p>

      {/* Example sections (you can replace or expand these later) */}
      <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="font-semibold text-lg">Staff Overview</h2>
          <p className="text-sm text-gray-500">View and manage your staff team.</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="font-semibold text-lg">Tasks Progress</h2>
          <p className="text-sm text-gray-500">Track the status of assigned tasks.</p>
        </div>
      </div>
    </div>
  );
}

export default TeamLead;
