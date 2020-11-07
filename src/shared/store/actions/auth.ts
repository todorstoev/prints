import { createAction } from 'typesafe-actions'
import { Vote } from '../../../components/ChatRoomDetails'

import { PrintsUser, RoomData } from '../../../types'

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_CANCEL,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_CANCEL,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    VERIFY_REQUEST,
    VERIFY_SUCCESS,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    SSO_LOGIN_REQUEST,
    SSO_LOGIN_SUCCESS,
    VOTE_USER_REQUEST,
    VOTE_USER_SUCCESS,
} from '../constants'

export const requestLogin = createAction(LOGIN_REQUEST)<{
    email: string
    password: string
    remember: boolean
}>()

export const receiveLogin = createAction(LOGIN_SUCCESS)<PrintsUser>()

export const cancelLogin = createAction(LOGIN_CANCEL)()

export const requestSsoLogin = createAction(SSO_LOGIN_REQUEST)()

export const recieveSsoLogin = createAction(SSO_LOGIN_SUCCESS)<PrintsUser>()

export const requestRegister = createAction(REGISTER_REQUEST)<{
    email: string
    password: string
}>()

export const recieveRegister = createAction(REGISTER_SUCCESS)<PrintsUser>()

export const cancelRegister = createAction(REGISTER_CANCEL)()

export const requestLogout = createAction(LOGOUT_REQUEST)()

export const receiveLogout = createAction(LOGOUT_SUCCESS)()

export const verifyRequest = createAction(VERIFY_REQUEST)()

export const verifySuccess = createAction(VERIFY_SUCCESS)()

export const updateUserRequest = createAction(UPDATE_USER_REQUEST)<{
    user: PrintsUser
    data: any
}>()

export const updateUserSuccess = createAction(UPDATE_USER_SUCCESS)<PrintsUser>()

export const voteUserRequest = createAction(VOTE_USER_REQUEST)<{
    vote: Vote
    roomData: RoomData
}>()

export const voteUserSuccess = createAction(VOTE_USER_SUCCESS)()
