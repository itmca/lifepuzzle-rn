import {atom, selector} from 'recoil';
import {UserType} from '../types/user.type';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export const userState = atom<UserType | null>({
  key: 'userState',
  default: null,
});

export const selectedUserPhotoState = atom<PhotoIdentifier | undefined>({
  key: 'selectedUserPhotoState',
  default: undefined,
});

export const writingUserState = atom<UserType>({
  key: 'wrtingUserState',
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
      return;
    }

    const modifiedImage = user.modifiedImage;
    const currentUserPhotoUri = modifiedImage
      ? modifiedImage.node.image.uri
      : user.imageURL;

    return currentUserPhotoUri;
  },
});
