import {RecoilState, useRecoilState, useRecoilValue} from 'recoil';

export const useUpdateObserver = (updaterState: RecoilState<number>) => {
  return useRecoilValue<number>(updaterState);
};

export const useUpdatePublisher = (updaterState: RecoilState<number>) => {
  const [version, setVersion] = useRecoilState<number>(updaterState);
  return () => {
    if (version >= 10000000000000) {
      setVersion(0);
    } else {
      setVersion(version + 1);
    }
  };
};
