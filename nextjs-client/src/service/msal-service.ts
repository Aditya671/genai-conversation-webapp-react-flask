import { PublicClientApplication, Configuration, AccountInfo } from '@azure/msal-browser';
import { graphConfig, loginRequests } from '../configurations/msalConfig';

export type MSALConfig = Configuration;

export class MSALService {
  private msalInstance: PublicClientApplication;

  constructor(config: MSALConfig) {
    this.msalInstance = new PublicClientApplication(config);
  }

  getAccount(): AccountInfo | null {
    const accounts = this.msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  /**
   * Attaches a given access token to a MS Graph API call. Returns information about the user
   */
  async callMsGraph(accessToken: string): Promise<Record<string, unknown>> {
    const bearer = `Bearer ${accessToken}`;
    const headers = new Headers();
    headers.append('Authorization', bearer);
    const options = {
      method: 'GET',
      headers: headers,
    };
    try {
      const response = await fetch(graphConfig.graphMeEndpoint, options);
      return await response.json();
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async retrieveProfileData(
    instance: PublicClientApplication,
    accounts: AccountInfo[]
  ): Promise<unknown> {
    const isInstanceAvailable = instance.getActiveAccount();
    if (!isInstanceAvailable && accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
    }
    try {
      // Ensure scopes are string[]
      const scopes = (loginRequests.scopes || []).filter((s: unknown): s is string => typeof s === 'string');
      const response = await instance.acquireTokenSilent({
        ...loginRequests,
        scopes,
        account: instance.getActiveAccount() || accounts[0],
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
