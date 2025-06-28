import React, { useEffect, useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { callMsGraph } from "./services/msal-service";
import { loginRequests } from "./config/msalConfig";
import { BrowserRouter } from "react-router-dom";
import UnauthorizedUser from "./container/unauthorized-user";
import store from "./store/store";
import RoutesContainer from "./routes";
import { isEmpty, isNull } from "lodash";
import { useBackendTokenCheckExpirationTime } from "./hooks/useBackendTokenCheckExpirationTime";

function App() {
    const { instance, accounts, inProgress } = useMsal();
    const isTokenValid = useBackendTokenCheckExpirationTime(instance, accounts);
    const msalUserInfo = JSON.parse(localStorage.getItem('MsalUserInfo')) || {};
    const [emailFromSSO, setEmailFromSSO] = useState('');
    const [hasAccessToken, setHasAccessToken] = useState(false);
    useEffect(() => {
        const acquireTokenWithRefreshToken = async () => {
            if (accounts.length && instance) {
                await instance
                    .acquireTokenSilent({
                        ...loginRequests,
                        account: accounts[0],
                    })
                    .then(async (response) => {
                        sessionStorage.setItem('AccessToken', response.accessToken);
                        localStorage.setItem('AccessToken', response.accessToken);
                        await callMsGraph(response.accessToken)
                            .then(async (response) => {
                                const msalUserInfo = response
                                if (typeof msalUserInfo === 'object' && Object.keys(msalUserInfo).includes('mail') && !isEmpty(msalUserInfo)) {
                                    localStorage.setItem('emailFromSSO', msalUserInfo.mail)
                                    setEmailFromSSO(msalUserInfo.mail)
                                    setHasAccessToken(true)
                                }
                                localStorage.setItem('MsalUserInfo', JSON.stringify(msalUserInfo))
                            })
                            .catch(async (e) => console.log(e));
                    })
            }
        }
        if (isNull(msalUserInfo) || isEmpty(msalUserInfo)) {
            acquireTokenWithRefreshToken()
        }
        return () => acquireTokenWithRefreshToken()
    }, [instance, accounts, inProgress, msalUserInfo]);



    return (
        <>
            <AuthenticatedTemplate>
                <BrowserRouter future={{ v7_startTransition: true }} basename='/planning-app/'>
                    <Provider store={store}>
                        <RoutesContainer emailFromSSO={emailFromSSO} hasAccessToken={hasAccessToken} hasInstance={instance} />
                    </Provider>
                </BrowserRouter>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <UnauthorizedUser />
            </UnauthenticatedTemplate>
        </>
    );
}

export default App;
