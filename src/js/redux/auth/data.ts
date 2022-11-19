import { AxiosPromise } from 'axios';

import { post } from '../../lib/request';

export function postLogin(username: string, password: string): AxiosPromise {
	const bodyFormData = new FormData();

	bodyFormData.append('username', username);
	bodyFormData.append('password', password);

	return post('auth/login', {
		data: bodyFormData,
		headers: { 'Content-Type': 'www-form-urlencoded' }
	});
}
