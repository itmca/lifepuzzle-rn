import {HeroAuthTypeCode} from '../../constants/auth.constant';

export type HookProps = {
  onSuccess: () => void;
};

export type UserAuthRequestBody = {
  heroNo: number;
  userNo: number;
  heroAuthStatus: HeroAuthTypeCode;
};
