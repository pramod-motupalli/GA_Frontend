import React, { useState } from 'react';
import PlanList from './PlanList'; // Adjust the path if needed

const Main = () => {
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true); // Add this
  const billingType = isMonthly ? 'monthly' : 'yearly'; // Add this

  const monthlyPlans = [
    {
      title: 'Pro',
      price: 100,
      features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'],
    },
    {
      title: 'Intro',
      price: 300,
      features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'],
    },
    {
      title: 'Basic',
      price: 200,
      features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'],
    },
  ];

  const yearlyPlans = [
    {
      title: 'Pro',
      price: 1000,
      features: ['All limited links', 'Own analytics platform', 'Chat support', 'Optimize hashtags', 'Unlimited users'],
    },
    {
      title: 'Intro',
      price: 2800,
      features: ['Dedicated account', 'Tailored analytics', '24/7 support', 'AI-driven hashtag', 'Unlimited users'],
    },
    {
      title: 'Basic',
      price: 1800,
      features: ['Priority support', 'Custom analytics reports', 'Phone support', 'Advanced hashtag', 'Up to 50 users'],
    },
  ];

  const plans = isMonthly ? monthlyPlans : yearlyPlans; // Add this

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => setShowPlanPopup(true)}
          className="flex items-center gap-2 bg-[#4C74DA] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#3b5fc3] transition"
        >
          <span className="text-lg">+</span>
          New Project Request
        </button>
      </div>

      {/* Your main content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">You can list your existing project requests or workspaces here.</p>
      </div>

      {/* Modal Popup */}
      {showPlanPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl overflow-auto max-h-[90vh] relative shadow-lg">
            <button
              onClick={() => setShowPlanPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-4">Relevant plans to your request</h2>
            <PlanList plans={plans} type={billingType} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
