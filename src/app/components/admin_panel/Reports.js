import { useEffect, useState } from 'react'; 
import { CheckCircle, XCircle } from 'lucide-react';
import Alert from '../ui/Alert';
import Admin_loader from "../ui/Admin_loader";
import { fetchReports, markAsResolved, removeCompany } from '../../services/admin_panel/Reports_calls'; // <- new import!

function ComplaintsTable() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState([]);

  const showAlert = (type, message) => {
    const id = Date.now();
    setAlert((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlert((alerts) => alerts.filter((alert) => alert.id !== id));
    }, 4000);
  };

  useEffect(() => {
    fetchReports(setComplaints, setLoading, showAlert);
  }, []);

  const handleMarkAsResolved = (reportId) => {
    markAsResolved(reportId, complaints, setComplaints, showAlert);
  };

  const handleRemoveCompany = (companyId) => {
    removeCompany(companyId, complaints, setComplaints, showAlert);
  };

  const filteredComplaints = complaints?.filter(
    (complaint) => complaint.status !== true
  );

  if (loading) {
    return <Admin_loader />;
  }

  if (filteredComplaints?.length === 0) {
    return (
      <>
        {alert.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert((alerts) => alerts.filter((a) => a.id !== alert.id))}
          />
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-full">
      {filteredComplaints?.map((complaint) => (
        <div key={complaint.report_id} className="relative p-8 border rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition duration-300 ease-in-out w-full max-w-[500px] mx-auto">
          <p className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base mb-2">
            User Name/Id: <span className="font-semibold">{complaint.name} / {complaint.user_id}</span>
          </p>
          <p className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base mb-2">
            Description: {complaint.description}
          </p>
          <p className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base mb-2">
            Sentiment Rating: <span className="font-semibold">{complaint.sentiment_rating}</span>
          </p>
          <p className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base mb-4">
            Company Name: {complaint.company_name}
          </p>

          {alert.map((alert) => (
            <Alert
              key={alert.id}
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert((alerts) => alerts.filter((a) => a.id !== alert.id))}
            />
          ))}

          {/* Icons Section at Top Right */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-green-700"
              onClick={() => handleMarkAsResolved(complaint.report_id)}
            >
              <CheckCircle className="h-6 w-6" />
            </div>

            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-red-700"
              onClick={() => handleRemoveCompany(complaint.company_id)}
            >
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ComplaintsTable;
