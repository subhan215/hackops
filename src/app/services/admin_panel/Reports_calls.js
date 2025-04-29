// src/api/complaintsApi.js
import axios from "axios";

export const fetchReports = async (setComplaints, setLoading, showAlert) => {
  try {
    const response = await axios.get("/api/report/get_all_reports");
    setComplaints(response.data.data);
    showAlert('success', 'Reports fetched successfully!');
  } catch {
    showAlert('error', 'Failed to fetch reports');
  } finally {
    setLoading(false);
  }
};

export const markAsResolved = async (reportId, complaints, setComplaints, showAlert) => {
  try {
    const response = await axios.post("/api/report/mark_as_resolved", { report_id: reportId });
    if (response.data.success) {
      setComplaints(
        complaints.map((complaint) =>
          complaint.report_id === reportId ? { ...complaint, status: true } : complaint
        )
      );
      showAlert('success', 'Report marked as resolved successfully!');
    }
  } catch {
    showAlert('error', 'Failed to mark report as resolved');
  }
};

export const removeCompany = async (companyId, complaints, setComplaints, showAlert) => {
  try {
    await axios.post("/api/report/remove_company_agreement", { company_id: companyId });
    setComplaints(complaints.filter((complaint) => complaint.company_id !== companyId));
    showAlert('success', 'Company agreement removed successfully!');
  } catch {
    showAlert('error', 'Failed to remove company agreement');
  }
};
