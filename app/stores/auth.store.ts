import { create } from 'zustand';
import { AuthTokens } from '../types/auth/auth.type';
import { getTokenState } from '../service/core/auth.service';

interface AuthState {
  authTokens: AuthTokens;
  setAuthTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authTokens: {
    accessToken: '',
    refreshToken: '',
  },

  setAuthTokens: tokens => set({ authTokens: tokens }),

  clearAuth: () =>
    set({
      authTokens: {
        accessToken: '',
        refreshToken: '',
      },
    }),

  isLoggedIn: () => {
    const { authTokens } = get();
    if (!authTokens || !authTokens.accessToken) {
      return false;
    }

    const tokenState = getTokenState(authTokens);
    return tokenState !== 'Expire';
  },
}));
