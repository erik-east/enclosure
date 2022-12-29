export interface IAuthActionPayload {
	email?: string;
	error?: string;
	firstName?: string;
	lastName?: string;
	password?: string;
	username?: string;
}

export interface IAuthState {
	requestingCreateUser: boolean;
	requestingRemoveServerSideCookie: boolean;
	requestingSetServerSideCookie: boolean;
}
