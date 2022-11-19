export interface IAuthActionPayload {
	error?: string;
	password?: string;
	username?: string;
}

export interface IAuthState {
	requestingSetServerSideCookie: boolean;
}
