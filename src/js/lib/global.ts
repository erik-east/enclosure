import Cookies from 'js-cookie';

export function getAuthCookie(): any {
	if (Cookies.get('access_token') === undefined) {
		return undefined;
	}

	return Cookies.get('access_token');
}

export function isAuthenticated(): boolean {
	const authCookie = getAuthCookie();

	if (authCookie === undefined) {
		return false;
	}

	return true;
}
