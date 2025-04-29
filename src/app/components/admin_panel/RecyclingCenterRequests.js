import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import NoDataDisplay from "../animations/NoDataDisplay";
import Admin_loader from "../ui/Admin_loader";
import Alert from "../ui/Alert";
import { fetchRequests, updateRequestStatus } from "../../services/admin_panel/RecyclingCenterRequests_calls";
import { fetchAllAreaNames } from "../../services/fetch_areas";

const RecyclingCenterRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [areaNames, setAreaNames] = useState([]);
    const [alert, setAlert] = useState([]);
    
    const showAlert = (type, message) => {
        const id = Date.now();
        setAlert((prevAlerts) => [...prevAlerts, { id, type, message }]);
        setTimeout(() => {
            setAlert((alerts) => alerts.filter((alert) => alert.id !== id));
        }, 4000);
    };

    // Load requests
    useEffect(() => {
        fetchRequests(setRequests, setLoading, setError);
    }, []);

    // After requests are loaded, fetch area names
    useEffect(() => {
        if (requests && requests.length > 0) {
            fetchAllAreaNames(requests, setAreaNames, setLoading);
        }
    }, [requests]);

    if (loading) {
        return <Admin_loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6">
            {alert.map((alertItem) => (
                <Alert
                    key={alertItem.id}
                    type={alertItem.type}
                    message={alertItem.message}
                    onClose={() => setAlert((alerts) => alerts.filter((a) => a.id !== alertItem.id))}
                />
            ))}
            {requests?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requests.map((request, index) => (
                        <div
                            key={request.area_approval_id}
                            className="relative bg-white rounded-xl shadow-md border border-gray-300 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex space-x-1.5">
                                <button
                                    onClick={() => updateRequestStatus(request.request_id, "Approved", setRequests, showAlert)}
                                    className="p-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                                    title="Approve Request"
                                >
                                    <FaCheck className="sm:text-[1rem] text-[0.875rem]" />
                                </button>
                                <button
                                    onClick={() => updateRequestStatus(request.request_id, "Rejected", setRequests, showAlert)}
                                    className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
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
                                    <strong>Area Name:</strong> {areaNames[index] || 'loading...'}
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                    <strong>Company ID / Name:</strong> {request.company_id} / {request.company_name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <NoDataDisplay emptyText="No recycling center requests found" />
            )}
        </div>
    );
};

export default RecyclingCenterRequests;
