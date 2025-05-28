import { useEffect, useState } from 'react';

export default function ExpiredDomainHosting() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users/domain-hosting/')
      .then((res) => res.json())
      .then((raw) => {
        const expiredOnly = raw.filter((item) => item.status === 'expired');
        setData(expiredOnly);
      })
      .catch((err) => console.error('Error fetching domain data:', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Expired Domain & Hosting</h1>
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              {[
                'Domain Name',
                'Domain Provider',
                'Domain Account',
                'Domain Expire Date',
                'Hosting Provider',
                'Hosting Account',
                'Hosting Expire Date',
                'Status',
                'Alert',
              ].map((col) => (
                <th key={col} className="px-4 py-2 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-red-50">
                <td className="px-4 py-2">{row.domain_name || 'N/A'}</td>
                <td className="px-4 py-2">{row.domain_provider || 'N/A'}</td>
                <td className="px-4 py-2 whitespace-pre-wrap">{row.domain_account || 'N/A'}</td>
                <td className="px-4 py-2">{row.domain_expiry || 'N/A'}</td>
                <td className="px-4 py-2">{row.hosting_provider || 'N/A'}</td>
                <td className="px-4 py-2">{row.hosting_provider_name || 'N/A'}</td>
                <td className="px-4 py-2">{row.hosting_expiry || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                    Expired
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-red-700 font-medium italic">
                  Your H&amp;D services expired
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                  No expired records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
