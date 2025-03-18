import { useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";

const REFRESH_THRESHOLD = 300; // 5 minutes in seconds
const TOKEN_CHECK_INTERVAL = 3600000; // 1 minute in milliseconds


export const useBackendTokenAndCheckExpirationTime = (instance, accounts) => {
    const interval = useRef(null);
    const acquireTokenWithRefreshToken = async () => {
        try {
            if (accounts.length && instance) {
                const response = await instance.acquireTokenSilent({
                    account: accounts[0],
                });
                // const decodeToken = jwtDecode(response.accessToken);
                localStorage.setItem('AccessToken', response.accessToken);
                // localStorage.getItem('AccessToken')
                console.log('Token refreshed');
                console.log('Token renewed');
            }
        } catch (error) {
            console.log('Error refreshing token', error);  // Handle token refresh error
        }
    };
    useEffect(() => {
        const checkTokenExpiry = () => {
            const backendAccessToken = localStorage.getItem('AccessToken');
            if (backendAccessToken) {
                const decodeToken = jwtDecode(backendAccessToken);
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                const timeUntilExpiry = decodeToken.exp - currentTime;
                if (timeUntilExpiry <= REFRESH_THRESHOLD) {     // Token is about to expire or has expired, refresh it
                    acquireTokenWithRefreshToken();
                }
            }
        };
        interval.current = setInterval(checkTokenExpiry, TOKEN_CHECK_INTERVAL);
        checkTokenExpiry(); // Check token expiry immediately after mounting     
        return () => clearInterval(interval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null; // You might not need to return anything from this hook

};