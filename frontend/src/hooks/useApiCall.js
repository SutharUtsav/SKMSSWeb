import { useEffect, useState } from "react"

export const useApiCall = (api) => {
    const [data, setData] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await api();
                if (response.status === 1) {
                    setData(response);
                } else {
                    setError(response);
                }
            }
            catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);

    return { data, error };

}