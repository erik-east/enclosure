import axios, {
	AxiosError,
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
	Method
} from 'axios';

import { REQUEST_ERRORS, REQUEST_METHODS } from '../constants/REQUEST';

interface IRequestHeaders {
	[ propName: string ]: string;
	'Accept'?: string;
	'Access-Token'?: string;
	'Content-Type'?: string;
}

interface IRequestOptions {
	data?: Record<string, unknown> | FormData;
	headers?: IRequestHeaders;
	method?: string;
	params?: Record<string, unknown>;
	url?: string;
	withCredentials?: boolean;
}

interface IRequestResponse extends AxiosResponse {
	error?: string;
}

interface IRequestResponseError extends AxiosError {
	response?: IRequestResponse;
}

function getPrefix() {
	// TODO: Move this to a constant eventually and read from environment variables
	return 'http://enclosure.local-dev:8000/';
}

export function mergeRequestHeaders(headers: IRequestHeaders = {}): IRequestHeaders {
	const requestHeaders: IRequestHeaders = {
		'Content-Type': 'application/json'
	};
	const headersKeysExist = headers !== undefined && Object.keys(headers).length > 0;

	if (headersKeysExist) {
		for (const key in headers) {
			if (Object.prototype.hasOwnProperty.call(headers, key)) {
				requestHeaders[ key ] = headers[ key ];
			}
		}
	}

	return requestHeaders;
}

export function mergeRequestOptions(endpoint: string, method: string, options: IRequestOptions = {}): AxiosRequestConfig {
	const requestObject: AxiosRequestConfig = {};
	const optionsHasKeys = Object.keys(options).length > 0;
	const optionsHasDataKey = optionsHasKeys && Object.prototype.hasOwnProperty.call(options, 'data');

	if (!optionsHasKeys || !optionsHasDataKey) {
		if (method === REQUEST_METHODS.PATCH) {
			throw new Error(REQUEST_ERRORS.PATCH_REQUEST_NO_DATA);
		}

		if (method === REQUEST_METHODS.POST) {
			throw new Error(REQUEST_ERRORS.POST_REQUEST_NO_DATA);
		}

		if (method === REQUEST_METHODS.PUT) {
			throw new Error(REQUEST_ERRORS.PUT_REQUEST_NO_DATA);
		}
	}

	if (optionsHasKeys) {
		if (optionsHasDataKey &&
			(method === REQUEST_METHODS.DELETE
			|| method === REQUEST_METHODS.PATCH
			|| method === REQUEST_METHODS.POST
			|| method === REQUEST_METHODS.PUT)) {
			requestObject.data = options.data;
		}

		requestObject.headers = mergeRequestHeaders(options.headers);
		requestObject.params = Object.prototype.hasOwnProperty.call(options, 'params') ? options.params : {};
	}
	else {
		requestObject.headers = {
			'Content-Type': 'application/json'
		};
	}

	// Allows axios response to successfully set the cookie in the browser using the 'set-cookie' header
	requestObject.withCredentials = true;

	const prefix = getPrefix();

	requestObject.method = method as Method;
	requestObject.url = `${prefix}${endpoint}`;

	return requestObject;
}

export function request(endpoint: string, method: string, options: IRequestOptions = {}): AxiosPromise {
	if (endpoint === '') {
		throw new Error(REQUEST_ERRORS.MERGE_REQUEST_HEADERS_NO_ENDPOINT);
	}

	if (method === '') {
		throw new Error(REQUEST_ERRORS.MERGE_REQUEST_HEADERS_NO_METHOD);
	}

	const requestObject: AxiosRequestConfig = mergeRequestOptions(endpoint, method, options);

	return axios(requestObject).then((response: IRequestResponse) => {
		if (response.data !== undefined) {
			const { data, error } = response.data;

			if (error) {
				response.error = error;
			}

			if (data) {
				response.data = data;
			}
		}

		return response;
	}).catch((axiosError: IRequestResponseError) => {
		if (axiosError.response && axiosError.response.data) {
			const { error } = axiosError.response.data;

			if (error) {
				axiosError.response.error = error;
			}

			return axiosError.response;
		}

		throw new Error(axiosError.message);
	});
}

export function remove(endpoint: string, options: IRequestOptions = {}): AxiosPromise {
	return request(endpoint, REQUEST_METHODS.DELETE, options);
}

export function get(endpoint: string, options: IRequestOptions = {}): AxiosPromise {
	return request(endpoint, REQUEST_METHODS.GET, options);
}

export function patch(endpoint: string, options: IRequestOptions): AxiosPromise {
	return request(endpoint, REQUEST_METHODS.PATCH, options);
}

export function post(endpoint: string, options: IRequestOptions): AxiosPromise {
	return request(endpoint, REQUEST_METHODS.POST, options);
}

export function put(endpoint: string, options: IRequestOptions): AxiosPromise {
	return request(endpoint, REQUEST_METHODS.PUT, options);
}
