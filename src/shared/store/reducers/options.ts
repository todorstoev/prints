import { createReducer } from 'typesafe-actions';

import { RootAction, actions } from '..';

import { OptionsState } from '../../../types';

const initialState: OptionsState = {
  cloudMessageTokenValid: false,
  notificationsPermission: false,
};

let id: number = 0;

export const optionsReducer = createReducer<OptionsState, RootAction>(initialState)
  .handleAction(actions.setCloudMessageToken, (state, action) => {
    return {
      ...state,
      cloudMessageTokenValid: action.payload,
    };
  })
  .handleAction(actions.setNotficationPermision, (state, action) => {
    return {
      ...state,
      notificationsPermission: action.payload,
    };
  });
