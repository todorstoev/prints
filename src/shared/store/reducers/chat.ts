import { createReducer } from 'typesafe-actions';
import { RootAction, actions } from '..';
import { ChatState } from '../../../types';

const initialState: ChatState = {
  messages: [],
  writing: false,
  rooms: [],
  unred: 0,
  loadingRooms: false,
};

export const chatReducer = createReducer<ChatState, RootAction>(initialState)
  .handleAction(actions.setMessages, (state, action) => {
    return {
      ...state,
      messages: action.payload,
    };
  })
  .handleAction(actions.addPrevMessages, (state, action) => {
    return {
      ...state,
      messages: [...state.messages, ...action.payload],
    };
  })
  .handleAction(actions.addMessage, (state, action) => {
    if (state.messages.length === 0 && !state.writing) return state;

    return {
      ...state,
      messages: [action.payload, ...state.messages],
    };
  })
  .handleAction(actions.startWriting, (state, action) => {
    return {
      ...state,
      writing: action.payload,
    };
  })
  .handleAction(actions.roomRequest, (state) => {
    return {
      ...state,
      loadingRooms: true,
    };
  })
  .handleAction(actions.roomSuccess, (state, action) => {
    const unred = action.payload.data.reduce((accumulator, currentValue) => {
      if (
        !currentValue.data.recieverHasRed &&
        currentValue.data.reciever === action.payload.user.uid
      )
        accumulator++;
      return accumulator;
    }, 0);

    return {
      ...state,
      loadingRooms: false,
      rooms: action.payload.data,
      unred,
    };
  });
