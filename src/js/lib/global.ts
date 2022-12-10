import dayjs, { unix } from 'dayjs';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

export function getAuthCookie(): any {
	if (Cookies.get('access_token') === undefined) {
		return undefined;
	}

	return jwt_decode(Cookies.get('access_token'));
}

export function isAuthenticated(): boolean {
	const authCookie = getAuthCookie();

	if (authCookie === undefined) {
		return false;
	}

	const date = dayjs().toDate();
	const expires = unix(authCookie?.exp);

	if (dayjs(date).isBefore(expires)) {
		return true;
	}

	return false;
}
