import { AxiosPromise } from 'axios';

import { post } from '../../lib/request';

export function postCreateUser(username: string, email: string, firstName: string, lastName: string, password: string): AxiosPromise {
	return post('auth/create/user', {
		data: {
			email,
			first_name: firstName,
			last_name: lastName,
			password,
			username
		}
	});
}

export function postLogin(username: string, password: string): AxiosPromise {
	const bodyFormData = new FormData();

	bodyFormData.append('username', username);
	bodyFormData.append('password', password);

	return post('auth/login', {
		data: bodyFormData,
		headers: { 'Content-Type': 'www-form-urlencoded' }
	});
}

export function postLogout(): AxiosPromise {
	return post('auth/logout', { data: {} });
}
