import { useEffect, useState, useRef } from 'react';
import { Pencil, Eye, Trash } from 'lucide-react';

export default function DomainHostingTable() {
  const [data, setData] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const token = localStorage.getItem('accessToken');

  // Fetch domain-hosting data
  const fetchData = () => {
    if (!token) {
      alert("You are not logged in. Please login first.");
      return;
    }

    fetch('http://localhost:8000/api/users/domain-hosting/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch error");
        return res.json();
      })
      .then(setData)
      .catch((err) => console.error('Fetch error:', err));
  };
  useEffect(() => {
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
    alert(`Edit row ${index + 1}`);
    setOpenMenuIndex(null);
  };

  const handleRaise = (index) => {
    const row = data[index];
    if (!row.id) return;
    const confirmed = window.confirm(`Raise alert for row ${index + 1}?`);
    if (!confirmed) return;

    fetch(`http://localhost:8000/api/users/domain-hosting/${row.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'expired' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to raise alert');
        return res.json();
      })
      .then((updated) => {
        const newData = [...data];
        newData[index] = updated;
        setData(newData);
        alert('Alert raised successfully!');
      })
      .catch((err) => {
        console.error(err);
        alert('Error raising alert.');
      });

    setOpenMenuIndex(null);
  };

  const handleDelete = (index) => {
    alert(`Delete row ${index + 1}`);
    setOpenMenuIndex(null);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-3 py-2 text-left">Select</th>
            {[
              "Client Name", "Phone Number", "Email ID", "Domain Name", "Domain Provider",
              "Domain Account", "Domain Expire Date", "Hosting Provider", "Hosting Account",
              "Hosting Expire Date", "Assigned To", "Status", "H&D Payment Status"
            ].map((col) => (
              <th key={col} className="px-3 py-2 text-left">{col}</th>
            ))}
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="100%" className="text-center py-4 text-gray-500">
                No domain-hosting data found.
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const rowColorClass = getRowColorClass(row.hosting_expiry);
              return (
                <tr key={index} className={rowColorClass}>
                  <td className="px-3 py-2">
                    <input type="checkbox" className="accent-blue-600" />
                  </td>
                  <td>{row.client?.username || "Unknown Client"}</td>
                  <td>{row.client?.contact_number || "N/A"}</td>
                  <td>{row.client?.email || "N/A"}</td>
                  <td className="px-3 py-2">{row.domain_name}</td>
                  <td className="px-3 py-2">{row.domain_provider}</td>
                  <td className="px-3 py-2 whitespace-pre-line">{row.domain_account}</td>
                  <td className="px-3 py-2">{row.domain_expiry}</td>
                  <td className="px-3 py-2">{row.hosting_provider}</td>
                  <td className="px-3 py-2">{row.hosting_account}</td>
                  <td className="px-3 py-2 font-medium">{row.hosting_expiry}</td>
                  <td className="px-3 py-2">{row.assigned_to || 'Unknown'}</td>
                  <td className="px-3 py-2">
                    {row.status ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === 'running'
                          ? 'bg-green-100 text-green-700'
                          : row.status === 'expired'
                          ? 'bg-red-200 text-red-700'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {row.status}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Unknown</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={row.hd_payment_status || 'pending'}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const confirmed = window.confirm(`Change H&D status to '${newStatus}'?`);
                        if (!confirmed) return;

                        fetch(`http://localhost:8000/api/users/domain-hosting/${row.id}/`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ hd_payment_status: newStatus }),
                        })
                          .then((res) => {
                            if (!res.ok) throw new Error('Failed to update status');
                            return res.json();
                          })
                          .then((updated) => {
                            const newData = [...data];
                            newData[index] = updated;
                            setData(newData);
                          })
                          .catch((err) => {
                            console.error(err);
                            alert('Error updating H&D status.');
                          });
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="relative" ref={(el) => (menuRefs.current[index] = el)}>
                      <button
                        onClick={() =>
                          setOpenMenuIndex(openMenuIndex === index ? null : index)
                        }
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
                            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                          >
                            <Eye size={16} />
                            Raise alert
                          </li>
                          <li
                            onClick={() => handleDelete(index)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 cursor-pointer"
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
