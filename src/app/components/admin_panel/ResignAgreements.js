import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import NoDataDisplay from "../animations/NoDataDisplay";
import Admin_loader from "../ui/Admin_loader";
import Alert from "../ui/Alert";

// 🆕 Import APIs
import { fetchPendingAgreements, handleAgreementAction } from "../../services/admin_panel/ResignAgreements_calls";

const ResignAgreements = () => {
  const [pendingAgreements, setPendingAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState([]);

  const showAlert = (type, message) => {
    const id = Date.now();
    setAlert((prevAlerts) => [...prevAlerts, { id, type, message }]);
    setTimeout(() => {
      setAlert((alerts) => alerts.filter((alert) => alert.id !== id));
    }, 4000);
  };

  useEffect(() => {
    fetchPendingAgreements(setPendingAgreements, setLoading);
  }, []);

  const handleAction = (agreementId, action) => {
    handleAgreementAction(agreementId, action, setPendingAgreements, showAlert);
  };

  if (loading) {
    return <Admin_loader />;
  }

  return (
    <div className="flex p-6">
      {alert.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert((alerts) => alerts.filter((a) => a.id !== alert.id))}
        />
      ))}
      <div className="flex-grow p-6 rounded-lg">
        {pendingAgreements.length === 0 ? (
          <div className="flex items-center justify-center">
            <NoDataDisplay emptyText="No pending resignation agreements found." />
          </div>
        ) : (
          <div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {pendingAgreements.map((agreement) => (
                <li
                  key={agreement.resign_id}
                  className="relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg p-6 border border-gray-200"
                >
                  <div className="absolute top-4 right-4 flex space-x-3">
                    <button
                      onClick={() => handleAction(agreement.resign_id, "approved")}
                      className="text-green-600 hover:text-green-800 transition-colors p-2 rounded-full"
                      title="Approve"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                    </button>
                    <button
                      onClick={() => handleAction(agreement.resign_id, "rejected")}
                      className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full"
                      title="Reject"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <p className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                      Company ID / Name: {agreement.company_id} / {agreement.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Requested on: {new Date(agreement.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`${
                          agreement.status === "Approved"
                            ? "text-green-600"
                            : agreement.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        } font-semibold`}
                      >
                        {agreement.status}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResignAgreements;
