import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_AZURE_API_URI;

export const useAxios = (
    url: string,
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    payload?: unknown
) => {
    const [response, setResponse] = useState(undefined);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const controllerRef = useRef(new AbortController());
    const cancel = () => {
        controllerRef.current.abort();
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.request({
                    data: payload,
                    signal: controllerRef.current.signal,
                    method,
                    url,
                });
                setResponse(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
            } finally {
                setLoading(false);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { cancel, response, error, loading };
};
