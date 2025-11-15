import {atom, selector} from 'recoil';
import {UserType} from '../../types/user.type';
import {selectedUserPhotoState} from '../ui/selection.recoil';

export const userState = atom<UserType | null>({
  key: 'userState',
  default: null,
});

// Re-export for backward compatibility
export {selectedUserPhotoState};

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
      return;
    }

    const modifiedImage = user.modifiedImage;
    const currentUserPhotoUri = modifiedImage
      ? modifiedImage.node.image.uri
      : user.imageURL;

    return currentUserPhotoUri;
  },
});
