// submitMaterialsApi.js

// Fetch submit material requests
export const fetchRequests = async (setRequests, setError, setLoading) => {
    try {
      const response = await fetch("/api/admin/get_request_submit_materials/");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Update the status of a submit material request
  export const updateRequestStatus = async (
    requestId,
    status,
    setRequests,
    showAlert
  ) => {
    try {
      const response = await fetch(`/api/admin/updateRequestStatus/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: requestId,
          status,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update request status");
      }
  
      await response.json();
  
      // Remove updated request from list
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.request_id !== requestId)
      );
  
      showAlert("success", `Request has been ${status}`);
    } catch (err) {
      showAlert("error", err.message);
    }
  };
  