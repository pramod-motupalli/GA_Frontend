import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Customization = ({ onClose, plan }) => {
  const [features, setFeatures] = useState(['']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleDelete = (indexToDelete) => {
    if (features.length === 1) return;
    const updated = features.filter((_, i) => i !== indexToDelete);
    setFeatures(updated);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (features.some((f) => f.trim() === '')) {
      setError('Please fill out all feature fields before submitting.');
      return;
    }

    try {
      const payload = {
        title: plan.title,
        price: plan.price,
        billing: plan.type || 'monthly',
        features,
      };

      const response = await fetch('http://127.0.0.1:8000/api/users/submissions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        alert('Submission failed: ' + errorText);
        return;
      }

      console.log('Plan & domain/hosting info submitted successfully');
      navigate('/thankyou-custom');

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Submission failed: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="relative p-8 bg-white rounded-lg max-w-[500px] w-full shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <span
          className="absolute top-3 right-4 text-[22px] text-gray-500 cursor-pointer hover:text-gray-700 z-10"
          onClick={handleCancel}
          title="Close"
        >
          &times;
        </span>
        <h2 className="text-[1.8rem] text-[#447DCB] mb-2">Customize Your Plan</h2>
        <p className="text-[#444] mb-5">List down the features you need and raise a request.</p>

        <form onSubmit={handleSubmit}>
          {features.map((feat, index) => (
            <div key={index} className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder={`Feature ${index + 1}`}
                value={feat}
                onChange={(e) => handleChange(index, e.target.value)}
                className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-md"
              />
              {features.length > 1 && (
                <span
                  className="flex items-center justify-center p-1 cursor-pointer rounded hover:bg-[#ffeaea]"
                  title="Remove"
                  onClick={() => handleDelete(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18"
                    viewBox="0 0 24 24"
                    width="18"
                    fill="#ff4d4f"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                  </svg>
                </span>
              )}
            </div>
          ))}

          <div
            className="text-[#447DCB] font-semibold cursor-pointer mb-5 inline-block"
            onClick={handleAddFeature}
          >
            ➕ Add Feature
          </div>

          {error && (
            <p className="text-[#d93025] bg-[#fdecea] p-3 rounded text-sm mb-4">
              {error}
            </p>
          )}

          <div className="flex justify-between gap-3">
            <button
              type="submit"
              className="bg-[#447DCB] text-white px-5 py-3 rounded-lg font-semibold text-base hover:bg-[#447DCB]"
            >
              Raise a Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Customization;
