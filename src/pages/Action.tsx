import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useLocation, useHistory } from 'react-router-dom';
import { Box, Flex, Heading, Text, Link, Button } from 'rebass';
import { useForm } from 'react-hook-form';
import { Input } from '@rebass/forms';

import { useDispatch } from 'react-redux';

import { resetPassword, verifyCodeResetPassword, verifyEmail } from '../shared/services';
import { actions } from '../shared/store';

type Props = {
  actionCode: string | undefined;
  continueUrl: string | undefined;
};

type FormData = {
  password: string;
};

const Action: React.FC<RouteComponentProps> = ({ history }) => {
  const [mode, setMode] = useState<string>();

  const [actionCode, setActionCode] = useState<string>();

  const [continueUrl, setContinueUrl] = useState<string>();

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const mode = searchParams.get('mode');

    const actionCode = searchParams.get('oobCode');

    const continueUrl = searchParams.get('continueUrl');

    if (!mode) history.goBack();

    if (mode) setMode(mode);

    if (actionCode) setActionCode(actionCode);

    if (continueUrl) setContinueUrl(continueUrl);
  }, [location, history, actionCode]);

  return (
    <Box height={'100%'}>
      {mode === 'verifyEmail' && <VerifyEmail {...{ actionCode, continueUrl }} />}

      {mode === 'resetPassword' && <ResetPassword {...{ actionCode, continueUrl }} />}
    </Box>
  );
};

const VerifyEmail: React.FC<Props> = ({ actionCode }) => {
  const [verified, setVerified] = useState<boolean | null>(null);

  const history = useHistory();

  useEffect(() => {
    if (!actionCode) return;

    verifyEmail(actionCode)
      .then(() => setVerified(true))
      .catch(() => setVerified(false));
  }, [actionCode]);

  return (
    <Flex
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {verified === null && <></>}
      {verified && (
        <>
          <Heading>Your email has been verified</Heading>
          <Text>You can now sign in with your new account</Text>
        </>
      )}
      {verified === false && (
        <>
          <Heading my={1}>Try verifying your email again</Heading>
          <Text my={1}>
            Your request to verify your email has expired or the link has already been used
          </Text>
        </>
      )}
      <Link onClick={() => history.goBack()}>Go Back</Link>
    </Flex>
  );
};

const ResetPassword: React.FC<Props> = ({ actionCode }) => {
  const [verified, setVerified] = useState<boolean | null>(null);

  const history = useHistory();

  const { register, handleSubmit, errors, reset } = useForm<FormData>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!actionCode) return;
    verifyCodeResetPassword(actionCode)
      .then(() => setVerified(true))
      .catch(() => setVerified(false));
  }, [actionCode]);

  useEffect(() => {
    if (errors.password) {
      dispatch(actions.addNotification(errors.password.message as string));
    }
  }, [errors, dispatch]);

  const onSubmit = handleSubmit(({ password }) => {
    resetPassword(actionCode as string, password)
      .then(() => {
        history.push('/');
        dispatch(actions.addNotification('Password successfully changed'));
      })
      .catch((e) => {
        reset();
        dispatch(actions.addNotification(e as string));
      });
  });

  if (verified === null) return <></>;

  return (
    <Flex
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {verified === false && (
        <>
          <Text>Your code expired plese send new request</Text>
        </>
      )}
      {verified && (
        <>
          <form onSubmit={onSubmit}>
            <Flex justifyContent="center" alignContent="center" my={2}>
              <Input
                type={'password'}
                placeholder="password"
                mx={1}
                name={'password'}
                ref={register({
                  required: 'password is Required',
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
            (Enter your new password here)
          </Text>
        </>
      )}
    </Flex>
  );
};

export default Action;
