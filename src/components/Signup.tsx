import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Heading, Box, Text, Button, Flex, Link } from 'rebass';
import { Input } from '@rebass/forms';
import { RootState } from '../types';
import { Loader } from './Loader';
import { actions } from '../shared/store';

type Props = {
  setIsLogin: (login: boolean) => void;
};

const SignUp: React.FC<Props> = ({ setIsLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();

  const { error, isLoggingIn } = useSelector((state: RootState) => ({
    isLoggingIn: state.auth.isLoggingIn,
    error: state.errors.authError,
    isAuthenticated: state.auth.isAuthenticated,
  }));

  const handleEmailChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) =>
    setEmail(currentTarget.value);

  const handlePasswordChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) =>
    setPassword(currentTarget.value);

  const handleSubmit = () => dispatch(actions.requestRegister({ email, password }));

  useEffect(() => {
    if (error) dispatch(actions.addNotification(error.message));
  }, [error, dispatch]);

  return (
    <React.Fragment>
      {isLoggingIn && (
        <Flex justifyContent={'center'} alignItems={'center'} height={'100vh'}>
          <Loader></Loader>
        </Flex>
      )}
      {!isLoggingIn && (
        <Flex flexWrap="wrap" flex="1 0 auto" justifyContent={'space-evenly'}>
          <Box
            width={['auto']}
            className={'signup-form'}
            margin={'auto'}
            as="form"
            onSubmit={(e) => e.preventDefault()}
            p={20}
            backgroundColor={'#fff'}
          >
            <Box p={5} backgroundColor={'#fff'} sx={{ borderRadius: 6 }}>
              <Heading fontSize={5} color={'primary'}>
                Sign Up
              </Heading>

              <Input
                placeholder={'Email'}
                name={'email'}
                className={'email'}
                mt={2}
                onChange={handleEmailChange}
              />
              <Box height={10} />
              <Input
                name={'password'}
                type={'password'}
                className={'password'}
                placeholder={'Password'}
                mb={2}
                onChange={handlePasswordChange}
              />

              <Box mt={10} width={[1 / 1]}>
                <Button type={'button'} onClick={handleSubmit} variant="primary" width={[1 / 1]}>
                  Register
                </Button>

                <Flex flexWrap="wrap" mt={20} justifyContent={'start'}>
                  <Text mr={3}>Allready have an account ?</Text>

                  <Link
                    sx={{
                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => {
                      setIsLogin(true);
                      dispatch(actions.clearAuthErrors());
                    }}
                  >
                    Log In
                  </Link>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Flex>
      )}
    </React.Fragment>
  );
};

export default SignUp;
