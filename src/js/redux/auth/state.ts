import { IAuthState } from '../../types/IAuth';

const authState: IAuthState = {
	requestingCreateUser: false,
	requestingRemoveServerSideCookie: false,
	requestingSetServerSideCookie: false
};

export default authState;
