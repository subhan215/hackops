import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import NoDataDisplay from "../animations/NoDataDisplay";
import Admin_loader from "../ui/Admin_loader";
import Alert from "../ui/Alert";
import { fetchRequests, updateRequestStatus } from "../../services/admin_panel/SubmitMaterialRequests_calls"; // Import APIs

const SubmitMaterialRequests = () => {
  const [alert, setAlert] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const showAlert = (type, message) => {
    const id = Date.now();
    setAlert((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlert((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 4000);
  };

  useEffect(() => {
    fetchRequests(setRequests, setError, setLoading);
  }, []);

  const handleStatusChange = (requestId, status) => {
    updateRequestStatus(requestId, status, setRequests, showAlert);
  };

  if (loading) {
    return <Admin_loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {alert.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() =>
            setAlert((prevAlerts) => prevAlerts.filter((a) => a.id !== alert.id))
          }
        />
      ))}

      {requests.length > 0 ? (
        <div className="submit-material-requests grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div
              key={request?.request_id}
              className="card bg-white shadow-md rounded-lg border relative overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Buttons Positioned at the Top Right */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  className="bg-green-500 text-white p-1 sm:p-2 rounded-full hover:bg-green-600 transition duration-200"
                  onClick={() => handleStatusChange(request?.request_id, "Approved")}
                  title="Approve"
                >
                  <FaCheck className="sm:text-[1rem] text-[0.875rem]" />
                </button>
                <button
                  className="bg-red-500 text-white p-1 sm:p-2 rounded-full hover:bg-red-600 transition duration-200"
                  onClick={() => handleStatusChange(request?.request_id, "Rejected")}
                  title="Reject"
                >
                  <FaTimes className="sm:text-[1rem] text-[0.875rem]" />
                </button>
              </div>

              {/* Image */}
              <img
                src={request?.image_url}
                alt="Request"
                className="w-full h-48 sm:h-52 object-cover"
              />

              {/* Card Content */}
              <div className="p-5">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  <strong>Company ID:</strong> {request?.company_id}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  <strong>User ID:</strong> {request?.user_id}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-3">
                  <strong>Status:</strong> {request?.status}
                </p>

                {/* Material Totals */}
                <div className="mt-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                    Material Totals:
                  </h3>
                  <ul className="space-y-1">
                    <li className="flex justify-between text-xs sm:text-sm text-gray-600">
                      <span>Paper/Cardboard:</span>
                      <span>{request?.paper_cardboard_total}</span>
                    </li>
                    <li className="flex justify-between text-xs sm:text-sm text-gray-600">
                      <span>Plastics:</span>
                      <span>{request?.plastics_total}</span>
                    </li>
                    <li className="flex justify-between text-xs sm:text-sm text-gray-600">
                      <span>Metals:</span>
                      <span>{request?.metals_total}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoDataDisplay emptyText="No submit material requests found!" />
      )}
    </div>
  );
};

export default SubmitMaterialRequests;
