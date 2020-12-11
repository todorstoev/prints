import React, { useEffect } from 'react';

import { Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { Input } from '@rebass/forms';
import { Box, Button, Flex, Text } from 'rebass';

import { actions } from '../shared/store';

import { resetPasswordsRequest } from '../shared/services';

import { AuthState, RootState } from '../types';

type FormData = {
  email: string;
};

const RequestResetPassword: React.FC = () => {
  const { isAuthenticated } = useSelector<RootState, AuthState>((state) => state.auth);

  const dispatch = useDispatch();

  const { register, handleSubmit, errors, reset } = useForm<FormData>();

  const history = useHistory();

  useEffect(() => {
    if (errors.email) {
      dispatch(actions.addNotification(errors.email.message as string));
    }
  }, [errors, dispatch]);

  const onSubmit = handleSubmit(({ email }) => {
    resetPasswordsRequest(email)
      .then((res: string) => {
        dispatch(actions.addNotification(`Confirmation email send to ${res}`));
        reset();
        history.goBack();
      })
      .catch((e: string) => {
        dispatch(actions.addNotification(e));
        reset();
      });
  });

  if (isAuthenticated) return <Redirect to={'/'} />;

  return (
    <Flex
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <form onSubmit={onSubmit}>
        <Flex justifyContent="center" alignContent="center" my={2}>
          <Input
            placeholder="email"
            mx={1}
            name={'email'}
            ref={register({
              required: 'email is Required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <Box>
            <Button mx={1} type={'submit'}>
              Send
            </Button>
          </Box>
        </Flex>
      </form>
      <Text fontSize={1} my={2}>
        (Enter address where you want us to send verification email)
      </Text>
    </Flex>
  );
};

export default RequestResetPassword;
