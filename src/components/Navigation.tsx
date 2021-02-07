import { useTheme } from 'emotion-theming';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Map, MessageCircle, LogIn, Search } from 'react-feather';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { animated, useTransition } from 'react-spring';
import { Box, Flex, Image } from 'rebass';

import { AuthState, ChatState, MapState, RootState } from '../types';
import { MapFilter } from './MapFilter';

type Props = {
  location: any;
};

enum Network {
  online = 'online',
  offline = 'offline',
  hidden = 'hidden',
}

const Navigation: React.FC<Props> = ({ location }) => {
  const [bottomBarHeight, setBottomBarHeight] = useState<number | null>(null);

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [network, setNetwork] = useState<Network>(Network.hidden);

  const { user, isAuthenticated, isVerifying, unred } = useSelector<
    RootState,
    AuthState & MapState & ChatState
  >((state) => ({ ...state.auth, ...state.map, ...state.chat }));

  const mainTheme = useTheme<any>();

  useLayoutEffect(() => {
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          if (
            mutation.addedNodes[0] !== undefined &&
            (mutation.addedNodes[0] as HTMLElement).classList !== undefined &&
            (mutation.addedNodes[0] as HTMLElement).classList.contains('CookieConsent')
          ) {
            setBottomBarHeight((mutation.addedNodes[0] as Element).getBoundingClientRect().height);
          }
          if (
            mutation.removedNodes[0] !== undefined &&
            (mutation.removedNodes[0] as HTMLElement).classList !== undefined &&
            (mutation.removedNodes[0] as HTMLElement).classList.contains('CookieConsent')
          ) {
            setBottomBarHeight(null);
          }
        }
      }
    });

    observer.observe(document.body, config);
  }, []);

  const handleConnection = (e: Event) => {
    if (navigator.onLine) {
      setNetwork(Network.online);
    } else {
      setNetwork(Network.offline);
    }
  };

  useEffect(() => {
    window.addEventListener('online', handleConnection);
    window.addEventListener('offline', handleConnection);
  }, []);

  const transitions = useTransition(network, null, {
    from: {
      zIndex: 100,
      position: 'absolute',
      opacity: 0,
      color: '#fff',
      left: '50%',
      top: 10,
      borderRadius: 5,
      transform: 'translate(-50%, -100px)',
      background: 'rgba(0, 0, 0, 0.55)',
    },
    enter: () => async (next: any) => {
      return await next({ opacity: 1, transform: 'translate(-50%, 0%)' });
    },
    leave: () => async (next: any) => {
      return await next({ opacity: 0, transform: 'translate(-50%, -100px)' });
    },
    onRest: (item: Network) => {
      setTimeout(() => {
        if (item === Network.online) setNetwork(Network.hidden);
      }, 2000);
    },
  } as any);

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
              {!isVerifying && <LogIn size={42}></LogIn>}
            </Box>
          </Link>
        )}
      </Box>
      {(location.pathname === '/' || (location.pathname === '/profile' && isAuthenticated)) &&
        isAuthenticated && (
          <Box
            variant={'navAvatar'}
            m={'auto'}
            my={3}
            sx={{
              userSelect: 'none',
              position: 'fixed',
              bottom: bottomBarHeight ? bottomBarHeight : 0,
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
                {unred > 0 && (
                  <Box
                    sx={{
                      color: 'background',
                      textDecoration: 'none',
                      bg: 'red',
                      borderRadius: '180px',
                      padding: '0.2rem 0.6rem',
                      position: 'absolute',
                      top: '-10px',
                      right: '-5px',
                    }}
                  >
                    {unred}
                  </Box>
                )}
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
            bottom: bottomBarHeight ? bottomBarHeight : 0,
            left: '0em',
            zIndex: 10,
            bg: 'transperent',
            ':hover': {
              transform: 'scale(0.80)',
            },
          }}
        >
          <Box sx={{ position: 'absolute', left: 100, bottom: 10, zIndex: 30 }}>
            <MapFilter {...{ showFilter }}></MapFilter>
          </Box>
          <Box
            bg="#fff"
            color="primary"
            variant={'navAvatar'}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'small',
              border: '3px solid',
              borderColor: showFilter ? 'primary' : 'transparent',
              ':active': {
                transform: 'scale(0.9)',
              },
            }}
            onClick={() => setShowFilter(!showFilter)}
          >
            <Search size={42}></Search>
          </Box>
          <Box sx={{ position: 'absolute', right: '-10em', bottom: 20 }}>
            <Link
              to="/privacy-policy"
              style={{
                textDecoration: 'none',
                color: mainTheme.colors.background,
                background: 'rgba(0, 0, 0, 0.55)',
                padding: 6,
                borderRadius: 5,
              }}
            >
              Privacy Policy
            </Link>
          </Box>
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
            bottom: bottomBarHeight ? bottomBarHeight + 60 : 0 + 60,
            left: '0em',
            zIndex: 10,
            bg: 'transperent',
            ':hover': {
              transform: 'scale(0.80)',
            },
          }}
        ></Box>
      )}
      {transitions.map(({ item, key, props }) => {
        if (item === Network.online)
          return (
            <animated.div key={key} style={props}>
              <Flex p={2} alignItems={'center'} justifyContent={'center'}>
                <Box
                  mx={2}
                  sx={{
                    height: '10px',
                    width: '10px',
                    borderRadius: 180,
                    background: 'lightgreen',
                  }}
                />
                You are now online
              </Flex>
            </animated.div>
          );

        if (item === Network.offline)
          return (
            <animated.div key={key} style={props}>
              <Flex p={2} alignItems={'center'} justifyContent={'center'}>
                <Box
                  mx={2}
                  sx={{ height: '10px', width: '10px', borderRadius: 180, background: 'red' }}
                />
                You are now offline
              </Flex>
            </animated.div>
          );

        return <></>;
      })}
    </>
  );
};

export default Navigation;
