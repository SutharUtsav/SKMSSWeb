import { useEffect, useState } from "react"

export const useApiCall = (api: any) => {
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
            catch (error: any) {
                setError(error);
            }
        };
        fetchData();
    }, [api]);

    return { data, error };

}