import React, { Suspense, lazy } from 'react';
import { Route, Switch, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'emotion-theming';

import { Box, Button, Flex, Heading, Text } from 'rebass';

import { useTransition, animated } from 'react-spring';
import CookieConsent from 'react-cookie-consent';
import { Shield } from 'react-feather';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import CookiesPolicy from './pages/CookiesPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NoMatch from './pages/404';

import { NotificationsHub } from './components/NotificationsHub';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Loader from 'react-loader-spinner';

import { actions } from './shared/store';

import { RootState } from './types';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const ChatRoom = lazy(() => import('./pages/ChatRoom'));
const Action = lazy(() => import('./pages/Action'));

const RequestResetPassword = lazy(() => import('./pages/RequestPasswordReset'));

const CookieConsentComponent: React.FC = () => {
  const mainTheme = useTheme<any>();

  return (
    <Box>
      <Flex alignContent={'center'} justifyContent="start">
        <Flex
          width={[100, 50, 50]}
          alignContent={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Shield display={'block'} width={30}></Shield>
        </Flex>

        <Box>
          <Heading>Cookies policy</Heading>
          <Text>
            Our website uses cookies to analyze how the site is used and to ensure your experience
            is consistent between visits.{' '}
            <Link style={{ color: mainTheme.colors.secondary }} to={'/cookies-policy'}>
              Cookies Policy
            </Link>{' '}
            ,{' '}
            <Link style={{ color: mainTheme.colors.secondary }} to={'/privacy-policy'}>
              Privacy Policy
            </Link>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

const App: React.FC = () => {
  const location = useLocation();

  const transitions = useTransition(location, (location) => location.pathname, {
    from: { opacity: 0, transform: 'translate3d(2%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-2%,0,0)' },
  });

  const { isAuthenticated, isVerifying } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    options: state.options,
  }));

  const dispatch = useDispatch();

  const mainTheme = useTheme<any>();

  return (
    <Box className="App" height={'100vh'} width={'100%'} style={{ overflow: 'hidden' }}>
      {transitions.map(({ item: location, props, key }) => (
        <animated.div
          key={key}
          style={{
            ...props,
            height: '100vh',
            position: 'absolute',
            width: '100%',
          }}
        >
          <Suspense
            fallback={
              <Flex justifyContent={'center'} alignItems={'center'} height={'100%'} width={'100%'}>
                <Loader type="BallTriangle" color="#00BFFF" height={15} width={15}></Loader>
              </Flex>
            }
          >
            <Switch location={location}>
              <Route exact path="/action" component={Action} />
              <Route exact path="/cookies-policy" component={CookiesPolicy} />
              <Route exact path="/privacy-policy" component={PrivacyPolicy} />
              <Route exact path="/reset" component={RequestResetPassword} />
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <ProtectedRoute
                exact
                path="/profile"
                component={Profile}
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
              />
              <ProtectedRoute
                exact
                path="/messages"
                component={ChatRoom}
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
              />
              <Route component={NoMatch} />
            </Switch>
          </Suspense>
        </animated.div>
      ))}
      <Navigation location={location} />
      <NotificationsHub />
      <CookieConsent
        style={{ background: '#445159ad' }}
        buttonText="Ok"
        enableDeclineButton
        onAccept={() => dispatch(actions.setCookieConsent(true))}
        ariaAcceptLabel={'test'}
        buttonStyle={{
          background: '#259de0',
          color: mainTheme.colors.background,
          fontWeigth: mainTheme.fontWeights.body,
          borderRadius: 5,
          paddingLeft: mainTheme.space[3],
          paddingRight: mainTheme.space[3],
          paddingTop: mainTheme.space[2],
          paddingBottom: mainTheme.space[2],
        }}
        declineButtonStyle={{
          background: mainTheme.colors.background,
          color: '#259de0',
          fontWeigth: mainTheme.fontWeights.body,
          borderRadius: 5,
          paddingLeft: mainTheme.space[3],
          paddingRight: mainTheme.space[3],
          paddingTop: mainTheme.space[2],
          paddingBottom: mainTheme.space[2],
        }}
        // onDecline={() => {
        //   setTimeout(() => {
        //     Cookies.remove('CookieConsent');
        //     dispatch(actions.setCookieConsent(true));
        //   }, 100);
        // }}
        declineButtonText="Decline"
        ButtonComponent={Button}

        // declineButtonText={'Decline'}
        // enableDeclineButton
      >
        <CookieConsentComponent></CookieConsentComponent>
      </CookieConsent>
    </Box>
  );
};

export default App;
