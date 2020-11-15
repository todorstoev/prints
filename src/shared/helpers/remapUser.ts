import { PrintsUser } from '../../types';

export const remapUser = (user: any, username: string): PrintsUser => {
  return {
    email: user.user.email,
    firstName: user.additionalUserInfo.profile.given_name,
    lastName: user.additionalUserInfo.profile.family_name,
    pic: user.user.photoURL || '',
    username: username,
    uid: user.user.uid,
    rating: 100,
    devices: [],
  };
};
