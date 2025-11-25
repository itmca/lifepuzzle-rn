import { HeroAuthTypeCode } from '../../constants/auth.constant';

export type HookProps = {
  onSuccess: () => void;
};

export type UserAuthRequestBody = {
  heroId: number;
  userId: number;
  heroAuthStatus: HeroAuthTypeCode;
};
