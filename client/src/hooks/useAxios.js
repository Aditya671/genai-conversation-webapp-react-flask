import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_AZURE_API_URI;

export const useAxios = (url, method, payload) => {
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
                const resp = JSON.parse(response)
                console.log(resp)
                setResponse(resp.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(true);
            }
        })();
    }, []);

    return { cancel, response, error, loading };
};