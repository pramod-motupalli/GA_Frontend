import { useEffect, useState, useRef } from 'react';
import { Pencil, Eye, Trash } from 'lucide-react';

export default function App() {
  const [data, setData] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [statusMenuIndex, setStatusMenuIndex] = useState(null); // for status submenu
  const menuRefs = useRef([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users/domain-hosting/')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Fetch error:', err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openMenuIndex !== null &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(event.target)
      ) {
        setOpenMenuIndex(null);
        setStatusMenuIndex(null);
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
    return diff <= 30;
  };

  const handleEdit = (index) => {
    alert(`Edit row ${index + 1}`);
    setOpenMenuIndex(null);
  };

  const handleRaise = (index) => {
    setStatusMenuIndex(index);
  };

  const handleStatusUpdate = (rowId, index, status) => {
    fetch(`http://localhost:8000/api/users/domain-hosting/${rowId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(updated => {
        const newData = [...data];
        newData[index] = updated;
        setData(newData);
        alert(`Status updated to "${status}" successfully.`);
      })
      .catch(err => {
        console.error(err);
        alert("Error updating status.");
      })
      .finally(() => {
        setOpenMenuIndex(null);
        setStatusMenuIndex(null);
      });
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
            "Hosting Expire Date", "Status"
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
              <td className="px-3 py-2">
                {row.status ? (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${row.status === 'running' ? 'bg-green-100 text-green-700'
                      : row.status === 'expired' ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {row.status}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Unknown</span>
                )}
              </td>
              <td className="px-3 py-2 text-center">
                <div className="relative" ref={el => (menuRefs.current[index] = el)}>
                  <button
                    onClick={() => {
                      setOpenMenuIndex(openMenuIndex === index ? null : index);
                      setStatusMenuIndex(null);
                    }}
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                    aria-label="Open actions menu"
                  >
                    &#8942;
                  </button>

                  {openMenuIndex === index && (
                    <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-lg z-50 text-sm overflow-hidden">
                      <li
                        onClick={() => handleEdit(index)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                      >
                        <Pencil size={16} />
                        Edit
                      </li>
                      <li
                        onClick={() => handleRaise(index)}
                        className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-100 cursor-pointer"
                      >
                        <Eye size={16} />
                        Raise Alert
                      </li>
                      {statusMenuIndex === index && (
                        <ul className="ml-6 mt-1 border-l border-gray-200">
                          {['running', 'expiring', 'expired'].map(status => (
                            <li
                              key={status}
                              onClick={() => handleStatusUpdate(row.id, index, status)}
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </li>
                          ))}
                        </ul>
                      )}
                      <li
                        onClick={() => handleDelete(index)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <Trash size={16} />
                        Delete
                      </li>
                    </ul>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
