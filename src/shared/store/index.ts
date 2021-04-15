import { applyMiddleware, createStore } from 'redux';

import { createEpicMiddleware } from 'redux-observable';

import { batch } from 'react-redux';

import { logger } from 'redux-logger';

import { ActionType } from 'typesafe-actions';

import { RootState } from '../../types';

import * as actions from './actions';

import rootReducer from './reducers';

import * as API from '../services';

import { fbMessaging } from '../services/firebase';

import { rootEpics } from './epics';

export type RootAction = ActionType<typeof actions>;

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>({
  dependencies: API,
});

const middlewares: any[] = [epicMiddleware];

if (process.env.REACT_APP_ENV === 'dev') {
  middlewares.push(logger);
}

const configureStore = (initialState?: RootState) => {
  const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

  let shouldProceedSSO = sessionStorage.getItem('3dreact:sso');

  epicMiddleware.run(rootEpics);

  if (fbMessaging) {
    fbMessaging
      .getToken({ vapidKey: process.env.REACT_APP_WEBPUSH })
      .then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
          batch(() => {
            store.dispatch(
              shouldProceedSSO ? actions.requestSsoLogin() : actions.verifyUserRequest(),
            );
            store.dispatch(actions.setNotficationPermision(true));
            // store.dispatch(actions.setCloudMessageToken(currentToken));
          });
        } else {
          batch(() => {
            store.dispatch(
              shouldProceedSSO ? actions.requestSsoLogin() : actions.verifyUserRequest(),
            );
            store.dispatch(actions.setCloudMessageToken(false));
            store.dispatch(actions.setNotficationPermision(true));
          });
        }
      })
      .catch((err) => {
        batch(() => {
          console.log('An error occurred while retrieving token. ', err);
          store.dispatch(
            shouldProceedSSO ? actions.requestSsoLogin() : actions.verifyUserRequest(),
          );
          store.dispatch(actions.setNotficationPermision(false));
          store.dispatch(actions.setCloudMessageToken(false));
        });
      });

    fbMessaging.onMessage((payload) => {
      console.log('Message received. ', payload);
    });
  }

  if (shouldProceedSSO) sessionStorage.removeItem('3dreact:sso');

  return store;
};

export { actions };

export default configureStore;
