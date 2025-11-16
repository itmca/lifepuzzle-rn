// Temporary compatibility layer for remaining Recoil usage
// This will help identify what still needs to be migrated

export const useRecoilValue = (state: any) => {
  console.warn('useRecoilValue still being used:', state);
  return null;
};

export const useRecoilState = (state: any): [any, any] => {
  console.warn('useRecoilState still being used:', state);
  return [null, () => {}];
};

export const useSetRecoilState = (state: any) => {
  console.warn('useSetRecoilState still being used:', state);
  return () => {};
};

export const useResetRecoilState = (state: any) => {
  console.warn('useResetRecoilState still being used:', state);
  return () => {};
};
