import {atom} from 'recoil';
import {UserType} from '../types/user.type';
import {DUMMY_USER} from '../constants/dummy.constant';

export const userState = atom<UserType>({
  key: 'userState',
  default: DUMMY_USER,
});
