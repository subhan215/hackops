// api/rewardConversionApi.js

export async function fetchRewardConversions(setRewardConversions, setIsLoading) {
    try {
      const response = await fetch("/api/admin/get_reward_conversion_requests");
      const data = await response.json();
      setRewardConversions(data.data || []);
    } catch (error) {
      console.error("Error fetching reward conversions:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  export async function handleRewardConversionAction(
    conversionId,
    status,
    setRewardConversions
  ) {
    try {
      const response = await fetch("/api/admin/reward_conversion_action", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversionId, status }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setRewardConversions((prev) =>
          prev.map((conversion) =>
            conversion.conversion_id === conversionId
              ? { ...conversion, status }
              : conversion
          )
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error updating reward conversion status:", error);
    }
  }
  