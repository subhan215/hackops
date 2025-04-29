// src/api.js

// Fetch all area approval requests
export const fetchAreaApprovalRequests = async (setRequests, setLoading, showAlert) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("/api/admin/get_area_approval_requests");
      const data = await response.json();
      if (data.success) {
        setRequests(data.data); // Set the data here directly
      } else {
        showAlert("error", data.message); // Show alert if there’s an error
      }
    } catch (error) {
      console.error("Error fetching area approval requests:", error);
      showAlert("error", "Failed to load area approval requests.");
    } finally {
      setLoading(false); // Stop loading after the request
    }
  };
  
  // Approve a request
  export const approveRequest = async (areaApprovalId, setRequests, showAlert) => {
    try {
      const response = await fetch("/api/admin/area_approval_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ areaApprovalId }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert("success", "Request approved successfully!");
        fetchAreaApprovalRequests(setRequests, showAlert); // Refresh the requests list
      } else {
        showAlert("info", data.message);
      }
    } catch (error) {
      console.error("Error approving request:", error);
      showAlert("info", "Failed to approve request.");
    }
  };
  
  // Reject a request
  export const rejectRequest = async (areaApprovalId, setRequests, showAlert) => {
    try {
      const response = await fetch("/api/admin/area_rejection_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ areaApprovalId }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert("warning", "Request rejected successfully!");
        fetchAreaApprovalRequests(setRequests, showAlert); // Refresh the requests list
      } else {
        showAlert("info", data.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showAlert("info", "Failed to reject request.");
    }
  };
  