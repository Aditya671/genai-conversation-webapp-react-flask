import axios from "axios";
import { v4 } from 'uuid';
import { errorModal } from "../components/MessageModal";
import { isNull, isUndefined } from "lodash";


let numberOfAjaxCAllPending = 0;
axios.defaults.baseURL = process.env.REACT_APP_AZURE_API_URI;
let accessOrigin = !isNull( String(process.env.REACT_APP_AZURE_REDIRECT_URI) ) && !isUndefined( String(process.env.REACT_APP_AZURE_REDIRECT_URI) ) ? 
	String(process.env.REACT_APP_AZURE_REDIRECT_URI) : 'https://localhost:3000';

// Add a request interceptor
axios.interceptors.request.use(
	function (config) {
		numberOfAjaxCAllPending++;
		// show loader
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

// Add a response interceptor
axios.interceptors.response.use(
	function (response) {
		numberOfAjaxCAllPending--;
		if (numberOfAjaxCAllPending === 0) {
			//hide loader
		}
		return response;
	},
	function (error) {
		return Promise.reject(error);
	}
);
async function CustomAxios(url, method, body,
	headers = {
		"Content-Type": "application/json",
		'Access-Control-Allow-Origin': accessOrigin,
		'X-Frame-Options': 'SAMEORIGIN',
		'Strict-Transport-Security':'max-age=31536000, includeSubDomains',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS' }) {
	const generatedId = v4()
	const token = await localStorage.getItem('AccessToken') || '';
	if (!token) {
		return errorModal('Unauthorized User', 'Seems like you don\'t have access to use this application')
	}
	return await axios({
		url,
		method,
		data: body,
		headers: {
			Authorization: `Bearer ${token}`,
			'Webapp-Id': generatedId,
			...headers
		},
	});
}

export default CustomAxios;