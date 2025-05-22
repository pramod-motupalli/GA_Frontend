import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DomainHosting = ({ isOpen, onClose, selectedPlan }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    domainName: '',
    domainProvider: '',
    domainAccount: '',
    domainExpiry: '',
    hostingProvider: '',
    hostingProviderName: '',
    hostingExpiry: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    return {};
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!selectedPlan) {
      alert('No plan selected. Please select a plan first.');
      return;
    }

    const combinedData = {
      title: selectedPlan.title,
      price: selectedPlan.price,
      billing: selectedPlan.billing || 'monthly',
      features: selectedPlan.features,
      domain_hosting: {
        ...form,
        domainExpiry: form.domainExpiry === '' ? null : form.domainExpiry,
        hostingExpiry: form.hostingExpiry === '' ? null : form.hostingExpiry,
      },
    };

    localStorage.setItem('selectedPlanInfo', JSON.stringify(combinedData));
    navigate('/payment');
  };

  const handleClose = () => {
    setForm({
      domainName: '',
      domainProvider: '',
      domainAccount: '',
      domainExpiry: '',
      hostingProvider: '',
      hostingProviderName: '',
      hostingExpiry: '',
    });
    setErrors({});
    if (onClose) onClose();
    navigate('/plans');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-5 text-2xl font-bold text-gray-400 hover:text-black"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-blue-600 mb-6">Domain and Hosting Information</h2>

        {selectedPlan && (
          <p className="mb-4 text-gray-600">
            Selected Plan: <strong>{selectedPlan.title}</strong> – ₹{selectedPlan.price}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Domain Related Information</h4>

            <input
              type="text"
              placeholder="Domain Name"
              name="domainName"
              value={form.domainName}
              onChange={handleChange}
              autoComplete="off"
              className="w-full mb-4 p-3 border border-gray-300 rounded-md text-base placeholder-gray-400"
            />

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Domain Provider"
                  name="domainProvider"
                  value={form.domainProvider}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full p-3 border border-gray-300 rounded-md text-base placeholder-gray-400"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Domain Account"
                  name="domainAccount"
                  value={form.domainAccount}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full p-3 border border-gray-300 rounded-md text-base placeholder-gray-400"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="date"
                  name="domainExpiry"
                  value={form.domainExpiry}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                />
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Hosting Related Information</h4>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Hosting Provider"
                  name="hostingProvider"
                  value={form.hostingProvider}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full p-3 border border-gray-300 rounded-md text-base placeholder-gray-400"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Hosting Provider Name"
                  name="hostingProviderName"
                  value={form.hostingProviderName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full p-3 border border-gray-300 rounded-md text-base placeholder-gray-400"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="date"
                  name="hostingExpiry"
                  value={form.hostingExpiry}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Take a plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainHosting;
