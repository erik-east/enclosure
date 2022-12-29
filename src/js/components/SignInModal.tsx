import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from '@chakra-ui/react';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { useReduxState } from '../lib/redux';
import { requestSetServerSideCookie } from '../redux';

import { IAuthState } from 'js/types';

interface ISignInModal {
	isOpen: boolean;
	onClose: () => void;
	setSignUpModalVisibility: (visibility: boolean) => void;
}

const SignInModal: React.FC<ISignInModal> = ({ isOpen, onClose, setSignUpModalVisibility }) => {
	const dispatch = useDispatch();
	const initialRef = React.useRef(null);
	const { requestingSetServerSideCookie } = useReduxState<IAuthState>('auth');
	const requestSetServerSideCookieDispatch = bindActionCreators(requestSetServerSideCookie, dispatch);
	const [ username, setUsername ] = React.useState('');
	const [ password, setPassword ] = React.useState('');
	const [ showPassword, setShowPassword ] = React.useState(false);
	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const resetModal = (): void => {
		setUsername('');
		setPassword('');
	};

	const onModalClose = (): void => {
		onClose();
		resetModal();
	};

	const switchToSignUpModal = (): void => {
		onClose();
		setSignUpModalVisibility(true);
	};

	React.useEffect(() => {
		if (!requestingSetServerSideCookie) {
			resetModal();
			onClose();
		}
	}, [ requestingSetServerSideCookie ]);

	return (
		<Modal
			initialFocusRef={ initialRef }
			isCentered
			isOpen={ isOpen }
			onClose={ onModalClose }>
			<ModalOverlay
				bg='blackAlpha.300'
				backdropFilter='blur(5px) hue-rotate(60deg)' />

			<ModalContent>
				<ModalHeader borderTopRadius='6px' className='modal-header'>
					Sign In
				</ModalHeader>

				<ModalCloseButton />

				<ModalBody className='modal-body'>
					<FormControl>
						<FormLabel>Username</FormLabel>
						<Input
							onChange={ (event) => setUsername(event.target.value) }
							ref={ initialRef }
							type='search'
							placeholder='Enter username'
							value={ username } />
					</FormControl>

					<FormControl mt='10px'>
						<FormLabel>Password</FormLabel>
						<InputGroup size='md'>
							<Input
								onChange={ (event) => setPassword(event.target.value) }
								type={ showPassword ? 'text' : 'password' }
								pr='4.5rem'
								placeholder='Enter password'
								value={ password } />

							<InputRightElement width='4.5rem'>
								<Button h='1.75rem' size='sm' onClick={ togglePasswordVisibility }>
									{ showPassword ? 'Hide' : 'Show' }
								</Button>
							</InputRightElement>
						</InputGroup>
					</FormControl>
				</ModalBody>

				<ModalFooter borderBottomRadius='6px' display='flex' justifyContent='space-between'>
					<Button
						colorScheme='green'
						mr={ 3 }
						onClick={ switchToSignUpModal }>
              			Sign up
					</Button>

					<Button
						colorScheme='blue'
						disabled={ username === '' || password === '' }
						mr={ 3 }
						onClick={ () => requestSetServerSideCookieDispatch(username, password) }>
              			Login
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default SignInModal;
