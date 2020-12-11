import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Flex, Image } from 'rebass';
import { useSpring, animated as a } from 'react-spring';

import { RootState } from '../types';

import SignUp from '../components/Signup';
import SignIn from '../components/Signin';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const { transform, opacity } = useSpring({
    opacity: !isLogin ? 1 : 0,
    transform: `perspective(600px) rotateX(${!isLogin ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const { isAuthenticated, isLoggingIn } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <Box>
      {!isLoggingIn && (
        <Box mt={5} sx={{ textAlign: 'center' }}>
          <Image width={'15em'} src="./assets/orb-hq.png" />
        </Box>
      )}
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          overflow: 'hidden',
        }}
      >
        {isLogin ? (
          <a.div
            style={{
              opacity: opacity.interpolate((o: any) => 1 - o),
              transform,
            }}
          >
            <SignIn {...{ setIsLogin }} />
          </a.div>
        ) : (
          <a.div
            style={{
              opacity,
              transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
            }}
          >
            <SignUp {...{ setIsLogin }} />
          </a.div>
        )}
      </Flex>
    </Box>
  );
};

export default Login;
