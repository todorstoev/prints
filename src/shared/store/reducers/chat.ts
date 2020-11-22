import { createReducer } from 'typesafe-actions';
import { RootAction, actions } from '..';
import { ChatState } from '../../../types';

const initialState: ChatState = { canVote: false, messages: [], writing: false };

export const chatReducer = createReducer<ChatState, RootAction>(initialState)
  .handleAction(actions.setCanVote, (state, action) => {
    return {
      ...state,
      canVote: action.payload,
    };
  })
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
  });
