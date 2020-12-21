import React from 'react';
import { Map, MessageCircle, RefreshCcw, LogIn } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Image } from 'rebass';
import { actions } from '../shared/store';

import { AuthState, RootState } from '../types';

type Props = {
  location: any;
};

const Navigation: React.FC<Props> = ({ location }) => {
  const { user, isAuthenticated } = useSelector<RootState, AuthState>((state) => state.auth);

  const dispatch = useDispatch();

  const searchHandler = (e: any) => {
    dispatch(actions.requestMapBounds());
  };

  return (
    <>
      {location.pathname !== '/login' && (
        <Box
          m={'auto'}
          my={3}
          sx={{
            userSelect: 'none',
            position: 'fixed',
            left: '1.2em',
            top: '-0.4em',
            bg: 'transperent',
            zIndex: 10,
          }}
        >
          <Link to={isAuthenticated ? '/' : '/login'}>
            <Image backgroundColor={'transparent'} src={'./assets/orb.png'} size={50} />
          </Link>
        </Box>
      )}
      <Box
        variant={'navAvatar'}
        m={'auto'}
        my={3}
        sx={{
          userSelect: 'none',
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
        {location.pathname === '/' && isAuthenticated && (
          <Link to={'/profile'}>
            <Image backgroundColor={'#fff'} src={user.photoURL} variant={'navAvatar'} />
          </Link>
        )}

        {location.pathname !== '/' && (
          <Link to={'/'}>
            <Box
              bg="#fff"
              color="primary"
              variant={'navAvatar'}
              sx={{
                userSelect: 'none',
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

        {location.pathname === '/' && !isAuthenticated && (
          <Link to={'/login'}>
            <Box
              bg="#fff"
              color="primary"
              variant={'navAvatar'}
              sx={{
                userSelect: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'small',
              }}
            >
              <LogIn size={42}></LogIn>
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
            userSelect: 'none',
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
      {location.pathname === '/' && (
        <Box
          variant={'navAvatar'}
          m={'auto'}
          my={3}
          sx={{
            userSelect: 'none',
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
            onClick={searchHandler}
          >
            <RefreshCcw size={42}></RefreshCcw>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navigation;
