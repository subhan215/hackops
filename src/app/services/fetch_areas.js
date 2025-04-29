// API to fetch a single area name by lat and lon
export const fetchAreaName = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch area name`);
        }

        const data = await response.json();

        if (data?.address) {
            const { road, neighbourhood, city } = data.address;
            const areaName = `${road || ''} ${neighbourhood || ''} ${city || ''}`.trim() || "Unknown Area";
            return areaName;
        } else {
            return "Unknown Area";
        }
    } catch (error) {
        console.error("Error fetching area name:", error);
        return "Unknown Area";
    }
};

// API to fetch all area names for a list of requests
export const fetchAllAreaNames = async (requests, setAreaNames, setLoading) => {
    try {
        setLoading(true);

        const names = await Promise.all(
            requests.map(async (request) => {
                return await fetchAreaName(request.latitude, request.longitude);
            })
        );

        setAreaNames(names);
    } catch (error) {
        console.error("Error fetching all area names:", error);
        setAreaNames([]); // Fallback
    } finally {
        setLoading(false);
    }
};
