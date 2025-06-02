import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  // Fetch client info when modal opens
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/users/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error('Failed to fetch client info:', err);
      }
    };

    if (isOpen) {
      fetchClient();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        client: {
          id: userData?.id,
        },
        title: selectedPlan?.title || '',
        price: selectedPlan?.price || '',
        billing: selectedPlan?.billing || '',
        features: selectedPlan?.features || [],
        payment_status: 'Done',
        domain_hosting: {
          domainName: form.domainName,
          domainProvider: form.domainProvider,
          domainAccount: form.domainAccount,
          domainExpiry: form.domainExpiry,
          hostingProvider: form.hostingProvider,
          hostingProviderName: form.hostingProviderName,
          hostingExpiry: form.hostingExpiry,
        },
      };

      const response = await axios.post(
        'http://localhost:8000/api/users/submissions/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMessage('Domain & hosting info saved successfully!');
        setForm({
          domainName: '',
          domainProvider: '',
          domainAccount: '',
          domainExpiry: '',
          hostingProvider: '',
          hostingProviderName: '',
          hostingExpiry: '',
        });
        navigate('/payment');
      } else {
        setMessage('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error saving domain hosting info:', error);
      setMessage('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
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
    setMessage('');
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
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Domain and Hosting Information
        </h2>

        {selectedPlan && (
          <p className="mb-4 text-gray-600">
            Selected Plan: <strong>{selectedPlan.title}</strong> – ₹{selectedPlan.price}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Domain Related Info */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Domain Related Information
            </h4>

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

          {/* Hosting Related Info */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Hosting Related Information
            </h4>

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

          {/* Submit Button and Messages */}
          {message && (
            <p className={`mb-4 ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Saving...' : 'Take a plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainHosting;
