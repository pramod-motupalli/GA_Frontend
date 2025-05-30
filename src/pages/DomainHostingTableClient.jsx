import { useEffect, useState } from 'react';

export default function ExpiredDomainHosting() {
  const [data, setData] = useState([]);

  // Helper function to calculate background and text color based on expiry date
  const getRowColorClass = (expiryDate) => {
    if (!expiryDate) return 'bg-gray-50 text-gray-700';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time part
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diff = (expiry - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) return 'bg-red-100 text-red-800';           // Expired
    if (diff <= 30) return 'bg-yellow-100 text-yellow-800';   // Today or within 30 days
    return 'bg-white text-gray-900 hover:bg-gray-50';         // Running
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/users/domain-hosting/')
      .then((res) => res.json())
      .then((raw) => {
        // Filter only expired or expiring based on status
        const filtered = raw.filter(
          (item) => item.status === 'expired' || item.status === 'expiring'
        );
        setData(filtered);
      })
      .catch((err) => console.error('Error fetching domain data:', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Expiring / Expired Domain & Hosting</h1>
      {/* Removed `border` class here */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
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
            {data.map((row, index) => {
              const domainExpiryDate = row.domain_expiry;
              const hostingExpiryDate = row.hosting_expiry;

              // Choose earliest expiry date if both exist
              let earliestExpiry = null;
              if (domainExpiryDate && hostingExpiryDate) {
                earliestExpiry = new Date(domainExpiryDate) < new Date(hostingExpiryDate)
                  ? domainExpiryDate
                  : hostingExpiryDate;
              } else {
                earliestExpiry = domainExpiryDate || hostingExpiryDate;
              }

              const rowColorClass = getRowColorClass(earliestExpiry);

              const alertMsg =
                earliestExpiry && new Date(earliestExpiry) < new Date()
                  ? 'Your H&D services expired'
                  : 'Your H&D services are going to expire';

              return (
                <tr key={index} className={`${rowColorClass} hover:bg-opacity-80`}>
                  <td className="px-4 py-2">{row.domain_name || 'N/A'}</td>
                  <td className="px-4 py-2">{row.domain_provider || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-pre-wrap">{row.domain_account || 'N/A'}</td>
                  <td className="px-4 py-2">{row.domain_expiry || 'N/A'}</td>
                  <td className="px-4 py-2">{row.hosting_provider || 'N/A'}</td>
                  <td className="px-4 py-2">{row.hosting_provider_name || 'N/A'}</td>
                  <td className="px-4 py-2">{row.hosting_expiry || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                        ${
                          row.status === 'expired'
                            ? 'bg-red-300 text-red-900'
                            : row.status === 'expiring'
                            ? 'bg-yellow-300 text-yellow-900'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-medium italic">{alertMsg || 'N/A'}</td>
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                  No expiring or expired records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
