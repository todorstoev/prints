import { from, of } from 'rxjs'
import { catchError, exhaustMap, filter, mapTo, mergeMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'

import { Device, RootState } from '../../../types'

import * as API from '../../services'

import { actions, RootAction } from '..'

// export const verifyAuth: any = () => (dispatch: Dispatch) => {
//     dispatch(actions.verifyRequest())

//     myFirebase.auth().onAuthStateChanged(async user => {
//         if (user !== null) {
//             const userToInsert: PrintsUser = await getUserFromDb(user.uid)

//             dispatch(actions.receiveLogin(userToInsert))

//             dispatch(getDevicesFromLogin(userToInsert.devices as Device[]))
//         }

//         dispatch(actions.verifySuccess())
//     })
// }

// export const updateUser = (user: PrintsUser, newData: any) => async (
//     dispatch: Dispatch
// ) => {
//     dispatch(actions.updateUserRequest())

//     try {
//         if (newData.email !== user.email) await updateEmail(newData.email)

//         user.email = newData.email
//         user.firstName = newData.firstName
//         user.lastName = newData.lastName
//         user.username = newData.username

//         await updateUserDB(user)

//         dispatch(actions.updateUserSuccess(user))
//     } catch (e) {
//         throw e
//     }
// }

export const updateUserEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    typeof API
> = (action$, _state$, { updateUser }) =>
    action$.pipe(
        filter(isActionOf(actions.updateUserRequest)),
        mergeMap(action => {
            const { user, data } = action.payload

            return from(updateUser(user, data)).pipe(
                mergeMap(res => of(actions.updateUserSuccess(res)))
            )
        })
    )

export const verifyRequestEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    typeof API
> = (action$, _state$, { getCurrentUser }) =>
    action$.pipe(
        filter(isActionOf(actions.verifyRequest)),

        mergeMap(() => {
            return from(getCurrentUser()).pipe(
                mapTo(actions.verifySuccess()),
                catchError(() => {
                    return of(actions.receiveLogout())
                })
            )
        })
    )

export const registerUserEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    typeof API
> = (action$, _state$, { registerWithEmail }) =>
    action$.pipe(
        filter(isActionOf(actions.requestRegister)),

        mergeMap(action => {
            const { email, password } = action.payload

            return from(registerWithEmail(email, password)).pipe(
                mergeMap(user =>
                    of(
                        actions.recieveRegister(user),
                        actions.getDevicesFromLogin(user.devices as Device[]),
                        actions.clearAuthErrors()
                    )
                ),
                catchError((error: string) =>
                    of(
                        actions.recieveAuthError({
                            code: 'FbError',
                            message: error,
                        }),
                        actions.cancelRegister()
                    )
                )
            )
        })
    )

export const loginUserEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    typeof API
> = (action$, _state$, { loginWithEmail }) =>
    action$.pipe(
        filter(isActionOf(actions.requestLogin)),
        mergeMap(action => {
            const { email, password, remember } = action.payload

            return from(loginWithEmail(email, password, remember)).pipe(
                mergeMap(user => {
                    return of(
                        actions.receiveLogin(user),
                        actions.getDevicesFromLogin(user.devices as Device[]),
                        actions.clearAuthErrors()
                    )
                }),
                catchError((error: string) =>
                    of(
                        actions.recieveAuthError({
                            code: 'FbError',
                            message: error,
                        }),
                        actions.cancelLogin()
                    )
                )
            )
        })
    )

export const loginSSOEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    typeof API
> = (action$, _state$, { loginWithSsoFinish }) =>
    action$.pipe(
        filter(isActionOf(actions.requestSsoLogin)),
        exhaustMap(() => {
            return from(loginWithSsoFinish()).pipe(
                mergeMap(user => {
                    return of(
                        actions.recieveSsoLogin(user),
                        actions.getDevicesFromLogin(user.devices as Device[]),
                        actions.clearAuthErrors()
                    )
                })
            )
        })
    )

export const logoutUserEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    typeof API
> = (action$, _state$, { logoutUser }) =>
    action$.pipe(
        filter(isActionOf(actions.requestLogout)),
        mergeMap(() =>
            from(logoutUser()).pipe(
                mergeMap(() => {
                    return of(
                        actions.receiveLogout(),
                        actions.clearAuthErrors()
                    )
                }),
                catchError((error: string) =>
                    of(
                        actions.recieveAuthError({
                            code: 'FbError',
                            message: error,
                        })
                    )
                )
            )
        )
    )
