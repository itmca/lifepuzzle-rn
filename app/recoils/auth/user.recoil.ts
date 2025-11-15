import {atom, selector} from 'recoil';
import {UserType} from '../../types/user.type';

export const userState = atom<UserType | null>({
  key: 'userState',
  default: null,
});

export const writingUserState = atom<UserType>({
  key: 'writingUserState',
  default: {
    userNo: -1,
    userId: '',
    userNickName: '게스트',
    userType: 'none',
    recentHeroNo: -1,
    imageURL: '',
    modifiedImage: undefined,
    isProfileImageUpdate: false,
  },
});

export const getCurrentUserPhotoUri = selector({
  key: 'currentUserPhotoUriState',
  get: ({get}) => {
    const user = get(writingUserState);

    if (!user) {
      return undefined;
    }

    return user.modifiedImage?.node.image.uri || user.imageURL;
  },
});
