import { useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';

const REFRESH_THRESHOLD = 300; // 5 minutes in seconds
const TOKEN_CHECK_INTERVAL = 3600000; // 1 minute in milliseconds

export const useBackendTokenAndCheckExpirationTime = (instance: PublicClientApplication, accounts: AccountInfo[]) => {
    const interval = useRef<NodeJS.Timeout | null>(null);
    const acquireTokenWithRefreshToken = async () => {
        try {
            if (accounts.length && instance) {
                const response = await instance.acquireTokenSilent({
                    account: accounts[0],
                    scopes: []
                });
                localStorage.setItem('AccessToken', response.accessToken);
                console.log('Token refreshed');
                console.log('Token renewed');
            }
        } catch (error) {
            console.log('Error refreshing token', error);
        }
    };
    useEffect(() => {
        const checkTokenExpiry = () => {
            const backendAccessToken = localStorage.getItem('AccessToken');
            if (backendAccessToken) {
                const decodeToken: { exp?: number } = jwtDecode(backendAccessToken);
                const currentTime = Math.floor(Date.now() / 1000);
                if (typeof decodeToken.exp === 'number') {
                    const timeUntilExpiry = decodeToken.exp - currentTime;
                    if (timeUntilExpiry <= REFRESH_THRESHOLD) {
                        acquireTokenWithRefreshToken();
                    }
                }
            }
        };
        interval.current = setInterval(checkTokenExpiry, TOKEN_CHECK_INTERVAL);
        checkTokenExpiry();
        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};
