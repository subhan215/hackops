import { useEffect, useState } from "react";
import NoDataDisplay from "../animations/NoDataDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Admin_loader from "../ui/Admin_loader";
import { fetchRewardConversions, handleRewardConversionAction } from "../../services/admin_panel/RewardConversionRequests_calls"; // 👈 import api functions

const RewardConversionRequests = () => {
  const [rewardConversions, setRewardConversions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRewardConversions(setRewardConversions, setIsLoading);
  }, []);

  const handleAction = (conversionId, status) => {
    handleRewardConversionAction(conversionId, status, setRewardConversions);
  };

  if (isLoading) {
    return <Admin_loader />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {rewardConversions.length === 0 ? (
        <div className="flex items-center justify-center">
          <NoDataDisplay emptyText="No reward conversion requests" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewardConversions.map((conversion) => (
            <div
              key={conversion.conversion_id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-[#17cf42] transform hover:scale-105"
            >
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={() => handleAction(conversion.conversion_id, "Approved")}
                  className="text-green-500 hover:text-green-700 transition duration-200"
                  aria-label="Approve"
                >
                  <FontAwesomeIcon icon={faCheck} className="h-6 w-6" />
                </button>
                <button
                  onClick={() => handleAction(conversion.conversion_id, "Rejected")}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  aria-label="Reject"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-base sm:text-base md:text-lg font-semibold text-[#17cf42] mb-2">
                  {conversion.name}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4">
                  {conversion.email_id}
                </p>

                <div className="text-gray-800 space-y-2">
                  <p className="text-xs sm:text-sm md:text-base font-medium">
                    <span className="text-gray-600">Reward Amount: </span>
                    <span className="text-[#17cf42]">{conversion.conversion_amount}</span>
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-medium">
                    <span className="text-gray-600">Equivalent PKR: </span>
                    <span className="text-[#17cf42]">{conversion.equivalent_pkr}</span>
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-medium">
                    <span className="text-gray-600">Status: </span>
                    <span
                      className={`${
                        conversion.status === "Approved"
                          ? "text-green-600"
                          : conversion.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      } font-semibold`}
                    >
                      {conversion.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardConversionRequests;
