import React from 'react';
import { Map, MessageCircle, RefreshCcw } from 'react-feather';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Image } from 'rebass';

import { AuthState, RootState } from '../types';

type Props = {
  location: any;
};

const Navigation: React.FC<Props> = ({ location }) => {
  const { user, isAuthenticated } = useSelector<RootState, AuthState>((state) => state.auth);

  return (
    <>
      {location.pathname !== '/login' && (
        <Box
          m={'auto'}
          my={3}
          sx={{
            position: 'fixed',
            left: '1.2em',
            top: '-0.4em',
            bg: 'transperent',
            zIndex: 10,
          }}
        >
          <Link to={'/'}>
            <Image backgroundColor={'transparent'} src={'./assets/orb.png'} size={50} />
          </Link>
        </Box>
      )}
      <Box
        variant={'navAvatar'}
        m={'auto'}
        my={3}
        sx={{
          position: 'fixed',
          top: '-20px',
          right: '0em',
          zIndex: 10,
          '@media screen and (max-width: 40em)': {
            right: '0.2em',
            top: '-1em',
          },
        }}
      >
        {location.pathname === '/' && (
          <Link to={'/profile'}>
            <Image backgroundColor={'#fff'} src={user.photoURL} variant={'navAvatar'} />
          </Link>
        )}

        {location.pathname !== '/' && isAuthenticated && (
          <Link to={'/'}>
            <Box
              bg="#fff"
              color="primary"
              variant={'navAvatar'}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'small',
              }}
            >
              <Map size={42}></Map>
            </Box>
          </Link>
        )}
      </Box>
      {isAuthenticated && location.pathname !== '/messages' && (
        <Box
          variant={'navAvatar'}
          m={'auto'}
          my={3}
          sx={{
            position: 'fixed',
            bottom: 0,
            right: '0em',
            zIndex: 10,
            bg: 'transperent',
          }}
        >
          <Link to={'/messages'}>
            <Box
              bg="#fff"
              color="primary"
              variant={'navAvatar'}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'small',
                ':active': {
                  transform: 'scale(0.9)',
                },
              }}
            >
              <MessageCircle size={42}></MessageCircle>
            </Box>
          </Link>
        </Box>
      )}
      {isAuthenticated && (
        <Box
          variant={'navAvatar'}
          m={'auto'}
          my={3}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: '0em',
            zIndex: 10,
            bg: 'transperent',
          }}
        >
          <Box
            bg="#fff"
            color="primary"
            variant={'navAvatar'}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'small',
              ':active': {
                transform: 'scale(0.9)',
              },
            }}
          >
            <RefreshCcw size={42}></RefreshCcw>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navigation;
