import { create } from 'zustand';
import { UserType } from '../types/core/user.type';

interface UserState {
  user: UserType | null;
  writingUser: UserType;
  setUser: (user: UserType | null) => void;
  setWritingUser: (user: UserType) => void;
  resetUser: () => void;
  resetWritingUser: () => void;
  getCurrentUserPhotoUri: () => string | undefined;
}

const defaultWritingUser: UserType = {
  id: -1,
  loginId: '',
  nickName: '게스트',
  userType: 'none',
  recentHeroNo: -1,
  imageUrl: '',
  modifiedImage: undefined,
  isProfileImageUpdate: false,
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  writingUser: defaultWritingUser,

  setUser: user => set({ user }),

  setWritingUser: writingUser => set({ writingUser }),

  resetUser: () => set({ user: null }),

  resetWritingUser: () => set({ writingUser: defaultWritingUser }),

  getCurrentUserPhotoUri: () => {
    const { writingUser } = get();

    if (!writingUser) {
      return undefined;
    }

    return writingUser.modifiedImage?.node.image.uri || writingUser.imageUrl;
  },
}));
