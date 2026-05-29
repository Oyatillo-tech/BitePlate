import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useApi = (apiFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const setLoading = useAppStore((state) => state.setLoading);
    const setError = useAppStore((state) => state.setError);
    const loading = useAppStore((state) => state.loading);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await apiFunction();
                setData(response.data?.data || response.data);
                setError(null);
            } catch (error) {
                setError(error.response?.data?.error || 'An error occurred');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    return { data, loading };
};

export default useApi;