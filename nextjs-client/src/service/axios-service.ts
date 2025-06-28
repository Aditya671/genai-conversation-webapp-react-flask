import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { isNull, isUndefined } from 'lodash';

let numberOfAjaxCAllPending = 0;
const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// const accessOrigin = !isNull(String(process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI)) && !isUndefined(String(process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI))
//   ? String(process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI)
//   : 'http://localhost:3000';

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    numberOfAjaxCAllPending++;
    // show loader (implement as needed)
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    numberOfAjaxCAllPending--;
    if (numberOfAjaxCAllPending === 0) {
      // hide loader (implement as needed)
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export interface CustomAxiosOptions<T = unknown> {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  body?: T;
  config?: AxiosRequestConfig;
}

export async function customAxios<T = unknown>({ url, method, body, config }: CustomAxiosOptions): Promise<AxiosResponse<T>> {
  switch (method) {
    case 'get':
      return instance.get<T>(url, config);
    case 'post':
      return instance.post<T>(url, body, config);
    case 'put':
      return instance.put<T>(url, body, config);
    case 'delete':
      return instance.delete<T>(url, config);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}
