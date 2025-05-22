import { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users/submissions/')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const expiry = new Date(dateStr);
    const diff = (expiry - today) / (1000 * 60 * 60 * 24);
    return diff <= 30; // highlight if expiry within 30 days
  };

  return (
    <div className="p-4">
      <div className="overflow-auto shadow border border-gray-300 rounded">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-3 py-2 text-left border border-gray-300">Select</th>
              {[
                "Client Name", "Phone Number", "Email ID", "Domain Name", "Domain Provider",
                "Domain Account", "Domain Expire Date", "Hosting Provider", "Hosting Account",
                "Hosting Expire Date", "Assigned To"
              ].map((col) => (
                <th key={col} className="px-3 py-2 text-left border border-gray-300">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const red = isExpiringSoon(row.hosting_expiry);

              return (
                <tr key={index} className={`${red ? 'bg-red-100 text-red-800' : 'hover:bg-gray-50'}`}>
                  <td className="px-3 py-2 border border-gray-300">
                    <input type="checkbox" className="accent-blue-600" />
                  </td>
                  <td className="px-3 py-2 border border-gray-300">{row.client_name || 'Unknown'}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.phone_number || 'N/A'}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.email || 'N/A'}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.domain_name}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.domain_provider}</td>
                  <td className="px-3 py-2 border border-gray-300 whitespace-pre-line">{row.domain_account}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.domain_expiry}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.hosting_provider}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.hosting_provider_name}</td>
                  <td className="px-3 py-2 border border-gray-300 font-medium">{row.hosting_expiry}</td>
                  <td className="px-3 py-2 border border-gray-300">{row.assigned_to || 'Unknown'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
