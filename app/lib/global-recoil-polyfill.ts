// Global polyfill that assigns Recoil hooks to the global object
// This allows all remaining legacy code to continue working

import {
  useRecoilValue as recoilValue,
  useRecoilState as recoilState,
  useSetRecoilState as setRecoilState,
  useResetRecoilState as resetRecoilState,
} from './recoil-polyfill';

// Assign to global object
(global as any).useRecoilValue = recoilValue;
(global as any).useRecoilState = recoilState;
(global as any).useSetRecoilState = setRecoilState;
(global as any).useResetRecoilState = resetRecoilState;
