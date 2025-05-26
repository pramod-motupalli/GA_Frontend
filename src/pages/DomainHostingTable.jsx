import { useEffect, useState, useRef } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users/domain-hosting/')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // Close dropdown menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openMenuIndex !== null &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(event.target)
      ) {
        setOpenMenuIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuIndex]);

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const expiry = new Date(dateStr);
    const diff = (expiry - today) / (1000 * 60 * 60 * 24);
    return diff <= 30; // highlight if expiry within 30 days
  };

  // Action handlers (fill as needed)
  const handleEdit = (index) => {
    alert(`Edit row ${index + 1}`);
    setOpenMenuIndex(null);
  };

  const handleRaise = (index) => {
    alert(`Raise to Team Lead row ${index + 1}`);
    setOpenMenuIndex(null);
  };

  const handleDelete = (index) => {
    alert(`Delete row ${index + 1}`);
    setOpenMenuIndex(null);
  };

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100 text-gray-700 font-semibold">
        <tr>
          <th className="px-3 py-2 text-left">Select</th>
          {[
            "Client Name", "Phone Number", "Email ID", "Domain Name", "Domain Provider",
            "Domain Account", "Domain Expire Date", "Hosting Provider", "Hosting Account",
            "Hosting Expire Date", "Assigned To"
          ].map((col) => (
            <th key={col} className="px-3 py-2 text-left">{col}</th>
          ))}
          <th className="px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const red = isExpiringSoon(row.hosting_expiry);

          return (
            <tr key={index} className={`${red ? 'bg-red-100 text-red-800' : 'hover:bg-gray-50'}`}>
              <td className="px-3 py-2">
                <input type="checkbox" className="accent-blue-600" />
              </td>
              <td className="px-3 py-2">{row.client_name || 'Unknown'}</td>
              <td className="px-3 py-2">{row.phone_number || 'N/A'}</td>
              <td className="px-3 py-2">{row.email || 'N/A'}</td>
              <td className="px-3 py-2">{row.domain_name}</td>
              <td className="px-3 py-2">{row.domain_provider}</td>
              <td className="px-3 py-2 whitespace-pre-line">{row.domain_account}</td>
              <td className="px-3 py-2">{row.domain_expiry}</td>
              <td className="px-3 py-2">{row.hosting_provider}</td>
              <td className="px-3 py-2">{row.hosting_provider_name}</td>
              <td className="px-3 py-2 font-medium">{row.hosting_expiry}</td>
              <td className="px-3 py-2">{row.assigned_to || 'Unknown'}</td>
              <td className="relative px-3 py-2 text-center" ref={el => menuRefs.current[index] = el}>
                {/* 3 vertical dots button */}
                <button
                  onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                  className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  aria-label="Open actions menu"
                >
                  &#8942;
                </button>

                {/* Dropdown menu */}
                {openMenuIndex === index && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-10 text-sm">
                    <li
                      onClick={() => handleEdit(index)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Edit
                    </li>
                    <li
                      onClick={() => handleRaise(index)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Raise to Team Lead
                    </li>
                    <li
                      onClick={() => handleDelete(index)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                    >
                      Delete
                    </li>
                  </ul>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
