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
import { requestCreateUser, requestSetServerSideCookie } from '../redux';
import { IAuthState } from '../types';

interface ISignUpModal {
	isOpen: boolean;
	onClose: () => void;
}

const SignUpModal: React.FC<ISignUpModal> = ({ isOpen, onClose }) => {
	const dispatch = useDispatch();
	const initialRef = React.useRef(null);
	const { requestingCreateUser } = useReduxState<IAuthState>('auth');
	const requestCreateUserDispatch = bindActionCreators(requestCreateUser, dispatch);
	const requestSetServerSideCookieDispatch = bindActionCreators(requestSetServerSideCookie, dispatch);
	const [ username, setUsername ] = React.useState('');
	const [ email, setEmail ] = React.useState('');
	const [ firstName, setFirstName ] = React.useState('');
	const [ lastName, setLastName ] = React.useState('');
	const [ password, setPassword ] = React.useState('');
	const [ confirmPassword, setConfirmPassword ] = React.useState('');
	const [ showPassword, setShowPassword ] = React.useState(false);
	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const doesPasswordMatch = password === confirmPassword;
	// eslint-disable-next-line
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
	const isPasswordValid = passwordRegex.test(password);

	const resetModal = () => {
		setUsername('');
		setEmail('');
		setFirstName('');
		setLastName('');
		setPassword('');
		setConfirmPassword('');
	};

	const onModalClose = () => {
		onClose();
		resetModal();
	};

	React.useEffect(() => {
		if (!requestingCreateUser) {
			resetModal();
			onClose();
			// TODO: Only call the method below when sign up is successful
			requestSetServerSideCookieDispatch(username, password);
		}
	}, [ requestingCreateUser ]);

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
					Sign Up
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
						<FormLabel>Email</FormLabel>
						<Input
							onChange={ (event) => setEmail(event.target.value) }
							type='search'
							placeholder='Enter email'
							value={ email } />
					</FormControl>

					<FormControl mt='10px'>
						<FormLabel>First Name</FormLabel>
						<Input
							onChange={ (event) => setFirstName(event.target.value) }
							type='search'
							placeholder='Enter first name'
							value={ firstName } />
					</FormControl>

					<FormControl mt='10px'>
						<FormLabel>Last Name</FormLabel>
						<Input
							onChange={ (event) => setLastName(event.target.value) }
							type='search'
							placeholder='Enter last name'
							value={ lastName } />
					</FormControl>

					<FormControl mt='10px'>
						<FormLabel>Password</FormLabel>
						<InputGroup size='md'>
							<Input
								isInvalid={ password !== '' && !isPasswordValid }
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

					<FormControl mt='10px'>
						<FormLabel>Confirm Password</FormLabel>
						<InputGroup size='md'>
							<Input
								isInvalid={ confirmPassword !== '' && !doesPasswordMatch }
								onChange={ (event) => setConfirmPassword(event.target.value) }
								type={ showPassword ? 'text' : 'password' }
								pr='4.5rem'
								placeholder='Confirm password'
								value={ confirmPassword } />

							<InputRightElement width='4.5rem'>
								<Button h='1.75rem' size='sm' onClick={ togglePasswordVisibility }>
									{ showPassword ? 'Hide' : 'Show' }
								</Button>
							</InputRightElement>
						</InputGroup>
					</FormControl>
				</ModalBody>

				<ModalFooter borderBottomRadius='6px' display='flex' justifyContent='end'>
					<FormControl display='flex' flexDirection='column'>
						{
							!doesPasswordMatch && confirmPassword !== '' &&
							<FormLabel color='crimson' flexDirection='column' fontSize='14px' marginLeft='14px'>* Password confirmation does not match.</FormLabel>
						}

						{
							password !== '' && !isPasswordValid &&
							<FormLabel color='crimson' flexDirection='column' fontSize='14px' marginLeft='14px'>* Password must be 8-16 characters and include both numbers and letters.</FormLabel>
						}
					</FormControl>

					<Button
						colorScheme='green'
						disabled={ !isPasswordValid || !doesPasswordMatch }
						mr={ 3 }
						onClick={ () => requestCreateUserDispatch(username, email, password, firstName, lastName) }>
              			Sign up
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default SignUpModal;
