// src/services/recyclingCenterRequestsApi.js

// API to fetch requests
export const fetchRequests = async (setRequests, setLoading, setError) => {
    try {
        setLoading(true);
        const response = await fetch("/api/admin/get_recycling_center_requests/");
        if (!response.ok) {
            throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data.data); // Assuming the array is inside data.data
    } catch (error) {
        console.error("Error fetching requests:", error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

// API to update request status
export const updateRequestStatus = async (requestId, status, setRequests, showAlert) => {
    try {
        const response = await fetch(`/api/admin/update_recycling_center_request/`, {
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

        const updatedRequest = await response.json();
        console.log(updatedRequest);

        // Remove the updated request from the list
        setRequests(prevRequests =>
            prevRequests.filter(request => request.request_id !== requestId)
        );

        showAlert('success', `Request has been ${status}`);
    } catch (error) {
        console.error("Error updating request:", error);
        showAlert('error', error.message);
    }
};

