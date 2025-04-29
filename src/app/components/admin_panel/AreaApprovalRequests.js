// src/components/AreaApprovalRequests.js

import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import NoDataDisplay from "../animations/NoDataDisplay";
import Admin_loader from "../ui/Admin_loader";
import Alert from "../ui/Alert";
import { approveRequest, fetchAreaApprovalRequests, rejectRequest } from "../../services/admin_panel/AreaApprovalRequests_calls";


const AreaApprovalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState([]);

  // Function to show alerts
  const showAlert = (type, message) => {
    const id = Date.now();
    setAlert((prevAlerts) => [...prevAlerts, { id, type, message }]);
    setTimeout(() => {
      setAlert((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 4000);
  };

  // Fetch requests from the API
  useEffect(() => {
    fetchAreaApprovalRequests(setRequests, setLoading, showAlert);
  }, []);

  // Handle approving a request
  const handleApprove = (areaApprovalId) => {
    approveRequest(areaApprovalId, setRequests, showAlert);
  };

  // Handle rejecting a request
  const handleReject = (areaApprovalId) => {
    rejectRequest(areaApprovalId, setRequests, showAlert);
  };

  return (
    <div className="p-6">
      {alert.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert((prevAlerts) => prevAlerts.filter((a) => a.id !== alert.id))}
        />
      ))}

      {loading ? (
        <Admin_loader />
      ) : requests?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request) => (
            <div
              key={request.area_approval_id}
              className="relative bg-white rounded-xl shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {/* Action Icons */}
              <div className="absolute top-1 right-2 flex space-x-2">
                <button
                  onClick={() => handleApprove(request.area_approval_id)}
                  className="sm:p-1.5 p-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                  title="Approve Request"
                >
                  <FaCheck className="sm:text-[1rem] text-[0.875rem]" />
                </button>
                <button
                  onClick={() => handleReject(request.area_approval_id)}
                  className="sm:p-1.5 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                  title="Reject Request"
                >
                  <FaTimes className="sm:text-[1rem] text-[0.875rem]" />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                  {request.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-1">
                  <strong>Area ID:</strong> {request.area_id}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Company ID / Name:</strong> {request.company_id} / {request.company_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoDataDisplay emptyText="No area approval requests found" />
      )}
    </div>
  );
};

export default AreaApprovalRequests;
