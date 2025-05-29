import { useEffect, useState, useRef } from 'react';
import { Pencil, Eye, Trash } from 'lucide-react';

export default function App() {
  const [data, setData] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [statusMenuIndex, setStatusMenuIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editDates, setEditDates] = useState({});
  const menuRefs = useRef([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8000/api/users/domain-hosting/')
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error('Fetch error:', err));
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
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

  const getRowColorClass = (expiryDate) => {
    if (!expiryDate) return 'bg-gray-50 text-gray-700';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diff = (expiry - today) / (1000 * 60 * 60 * 24);
    if (diff < 0) return 'bg-red-100 text-red-800';
    if (diff <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-white text-gray-900 hover:bg-gray-50';
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditDates({
      domain_expiry: data[index].domain_expiry,
      hosting_expiry: data[index].hosting_expiry,
    });
    setOpenMenuIndex(null);
  };

  const saveEditedDates = (rowId, index) => {
    fetch(`http://localhost:8000/api/users/domain-hosting/${rowId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editDates),
    })
      .then(res => res.json())
      .then(updated => {
        const newData = [...data];
        newData[index] = updated;
        setData(newData);
        setEditIndex(null);
        alert('Expiry dates updated successfully.');
      })
      .catch(err => {
        console.error(err);
        alert("Error updating expiry dates.");
      });
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
      .then(res => res.json())
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
            "Hosting Expire Date", "Status", "H&D Payment Status"
          ].map((col) => (
            <th key={col} className="px-3 py-2 text-left">{col}</th>
          ))}
          <th className="px-3 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const rowColorClass = getRowColorClass(row.hosting_expiry);
          const isEditing = editIndex === index;

          return (
            <tr key={index} className={rowColorClass}>
              <td className="px-3 py-2">
                <input type="checkbox" className="accent-blue-600" />
              </td>
              <td className="px-3 py-2">{row.client_name || 'Unknown'}</td>
              <td className="px-3 py-2">{row.phone_number || 'N/A'}</td>
              <td className="px-3 py-2">{row.email || 'N/A'}</td>
              <td className="px-3 py-2">{row.domain_name}</td>
              <td className="px-3 py-2">{row.domain_provider}</td>
              <td className="px-3 py-2 whitespace-pre-line">{row.domain_account}</td>
              <td className="px-3 py-2">
                {isEditing ? (
                  <input
                    type="date"
                    value={editDates.domain_expiry || ''}
                    onChange={(e) =>
                      setEditDates({ ...editDates, domain_expiry: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  row.domain_expiry
                )}
              </td>
              <td className="px-3 py-2">{row.hosting_provider}</td>
              <td className="px-3 py-2">{row.hosting_provider_name}</td>
              <td className="px-3 py-2 font-medium">
                {isEditing ? (
                  <input
                    type="date"
                    value={editDates.hosting_expiry || ''}
                    onChange={(e) =>
                      setEditDates({ ...editDates, hosting_expiry: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  row.hosting_expiry
                )}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${row.status === 'running' ? 'bg-green-100 text-green-700'
                    : row.status === 'expired' ? 'bg-red-200 text-red-700'
                    : 'bg-yellow-200 text-yellow-800'}`}
                >
                  {row.status || <span className="text-gray-400 italic">Unknown</span>}
                </span>
              </td>
              <td className="px-3 py-2">
                <span className="text-gray-800 font-medium">
                  {row.hd_payment_status || 'N/A'}
                </span>
              </td>
              <td className="px-3 py-2 text-center">
                <div className="relative" ref={el => (menuRefs.current[index] = el)}>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditedDates(row.id, index)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditIndex(null)}
                        className="text-gray-500 hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
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
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 text-sm">
                          <ul className="divide-y divide-gray-100">
                            <li
                              onClick={() => handleEdit(index)}
                              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer"
                            >
                              <Pencil size={16} />
                              Edit Expiry
                            </li>
                            <li
                              onClick={() => handleRaise(index)}
                              className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 cursor-pointer relative"
                            >
                              <Eye size={16} />
                              Raise Alert
                            </li>
                            {statusMenuIndex === index && (
                              <div className="ml-4 mt-1 rounded-lg border border-gray-200 bg-gray-50">
                                {['running', 'expiring', 'expired'].map(status => {
                                  const colorClass = {
                                    running: 'text-green-700 hover:bg-green-100',
                                    expiring: 'text-yellow-800 hover:bg-yellow-200',
                                    expired: 'text-red-700 hover:bg-red-100',
                                  }[status];
                                  return (
                                    <div
                                      key={status}
                                      onClick={() => handleStatusUpdate(row.id, index, status)}
                                      className={`px-4 py-2 cursor-pointer ${colorClass} rounded-md text-sm font-medium transition-colors`}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <li
                              onClick={() => handleDelete(index)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash size={16} />
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </>
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
