// services/resignAgreementsApi.js

export const fetchPendingAgreements = async (setPendingAgreements, setLoading) => {
    try {
      const response = await fetch("/api/admin/get_resign_agreements", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      if (data.success) {
        setPendingAgreements(data.data || []);
      } else {
        setPendingAgreements([]);
      }
    } catch (error) {
      console.error("Error fetching pending resignation agreements:", error);
      setPendingAgreements([]);
    } finally {
      setLoading(false);
    }
  };
  
  export const handleAgreementAction = async (agreementId, action, setPendingAgreements, showAlert) => {
    try {
      const response = await fetch("/api/admin/approve_reject_resign_agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resign_id: agreementId,
          status: action, // either 'approve' or 'reject'
        }),
      });
  
      const data = await response.json();
      console.log(data);
      if (data.success) {
        // Remove the agreement from the list once it's successfully approved or rejected
        setPendingAgreements((prevAgreements) =>
          prevAgreements.filter(
            (agreement) => agreement.resign_id !== agreementId
          )
        );
      } else {
        showAlert('warning', `Failed to update agreement status`);
      }
    } catch (error) {
      console.error("Error updating agreement status:", error);
      showAlert('error', `Something went wrong while updating.`);
    }
  };
  