import { PrintsUser } from '../../types';

export const remapUser = (user: firebase.auth.UserCredential): PrintsUser => {
  return {
    email: user?.user?.email as string,
    displayName: user.user?.displayName as string,
    photoURL: user?.user?.photoURL ?? '',
    uid: user?.user?.uid as string,
    emailVerified: user.user?.emailVerified as boolean,
  };
};
