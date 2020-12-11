import React, { useEffect, useState } from 'react';

import { Button, Box, Heading, Text, Flex, Link, Image } from 'rebass';

import { Link as RouterLink } from 'react-router-dom';

import { Input, Label, Checkbox } from '@rebass/forms';

import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../types';

import { loginWithSSOStart } from '../shared/services';

import { Loader } from './Loader';
import { actions } from '../shared/store';

export enum ProviderSSO {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

type Props = {
  setIsLogin: (login: boolean) => void;
};

const SignIn: React.FC<Props> = ({ setIsLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(true);

  const { isLoggingIn, error } = useSelector((state: RootState) => ({
    isLoggingIn: state.auth.isLoggingIn,
    error: state.errors.authError,
  }));

  const dispatch = useDispatch();

  const handleEmailChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) =>
    setEmail(currentTarget.value);

  const handlePasswordChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) =>
    setPassword(currentTarget.value);

  const handleRememberMe = (e: React.FormEvent<HTMLInputElement>) => {
    setRemember(e.currentTarget.checked);
  };

  const handleSubmit = () => dispatch(actions.requestLogin({ email, password, remember }));

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
            className={'login-form'}
            margin={'auto'}
            as="form"
            onSubmit={(e) => e.preventDefault()}
            backgroundColor={'#fff'}
          >
            <Box p={5} backgroundColor={'#fff'} sx={{ borderRadius: 6 }}>
              <Heading fontSize={5} color={'primary'}>
                Sign In
              </Heading>

              <Input
                autoComplete={'on'}
                name={'email'}
                placeholder={'Email'}
                className={'email'}
                mt={2}
                onChange={handleEmailChange}
              />
              <Box height={10} />
              <Input
                autoComplete={'on'}
                name={'password'}
                placeholder={'Password'}
                className={'password'}
                type={'password'}
                mb={2}
                onChange={handlePasswordChange}
              />

              <Flex my={3}>
                <Box width={1 / 2} sx={{ whiteSpace: 'pre' }} mr={4}>
                  <Label fontSize={2}>
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={remember}
                      onChange={handleRememberMe}
                    />
                    Remember me
                  </Label>
                </Box>
                <Box
                  width={1 / 2}
                  fontSize={2}
                  sx={{
                    transition: 'all 0.2 linear',
                    whiteSpace: 'pre',
                    color: 'primary',
                    ':hover': {
                      color: 'secondary',
                    },
                  }}
                >
                  <RouterLink
                    style={{
                      wordBreak: 'keep-all',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                    to="/reset"
                  >
                    Forgot Password ?
                  </RouterLink>
                </Box>
              </Flex>
              <Box mt={15} width={[1 / 1]}>
                <Button variant="primary" onClick={handleSubmit} width={[1 / 1]}>
                  Sign In
                </Button>
              </Box>
              {/* <Text my={3 } textAlign={'center'}>
                OR
              </Text> */}
              <Box mt={15} width={[1 / 1]}>
                <Button
                  width={[1 / 1]}
                  backgroundColor={'background'}
                  color="gray"
                  sx={{ boxShadow: 'card' }}
                  onClick={() => loginWithSSOStart(ProviderSSO.GOOGLE)}
                >
                  <Flex justifyContent={'space-between'} alignItems="center">
                    <Image height={20} src="./assets/google-icon.svg"></Image>

                    <Box pr={4}>Sign in with Google</Box>
                  </Flex>
                </Button>
              </Box>
              <Box mt={15} width={[1 / 1]}>
                <Button
                  width={[1 / 1]}
                  backgroundColor={'#3b579d'}
                  color="background"
                  sx={{ boxShadow: 'card' }}
                  onClick={() => loginWithSSOStart(ProviderSSO.FACEBOOK)}
                >
                  <Flex justifyContent={'space-between'} alignItems="center">
                    <Image height={20} src="./assets/facebook-icon.png"></Image>

                    <Box pr={4}>Sign in with Facebook</Box>
                  </Flex>
                </Button>
              </Box>
              <Flex flexWrap="wrap" mt={20} justifyContent={'flex-start'}>
                <Text mr={3}>Dont have account ?</Text>

                <Link
                  sx={{
                    transition: 'all 0.2s linear',
                    ':hover': {
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => {
                    setIsLogin(false);
                    dispatch(actions.clearAuthErrors());
                  }}
                >
                  Register
                </Link>
              </Flex>
            </Box>
          </Box>
        </Flex>
      )}
    </React.Fragment>
  );
};

export default SignIn;
