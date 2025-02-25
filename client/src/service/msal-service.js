import { PublicClientApplication } from "@azure/msal-browser";
import { graphConfig, loginRequests, msalConfig } from "../configurations/msalConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken) {
    const bearer = `Bearer ${accessToken}`;

    const headers = new Headers();
    await headers.append("Authorization", bearer);

    const options = await {
        method: "GET",
        headers: headers
    };

    return await fetch(graphConfig.graphMeEndpoint, options)
        .then(async (response) => await response.json())
        .catch(async (error) => {
            await console.log(error)
            return await error;
        });

}
export const retrieveProfileData = (instance, accounts) => async (dispatch, getState) => {
    const isInstanceAvailable = await instance.getActiveAccount();
    if (!isInstanceAvailable) {
        await instance.setActiveAccount(instance.getAllAccounts()[0]);
    }

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
                    localStorage.setItem('MsalUserInfo', JSON.stringify(response))
                })
                .catch(async (e) => console.log(e));
        })
    return true
}
