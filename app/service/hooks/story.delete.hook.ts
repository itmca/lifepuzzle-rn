
import {uploadState} from '../../recoils/ui/upload.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from './update.hook';
import {storyListUpdate} from '../../recoils/shared/cache.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useEffect} from 'react';

type Props = {
  storyKey: string;
};
type GalleryProps = {
  galleryId: number;
};
export const useDeleteStory = ({storyKey}: Props): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setUploadState = useSetRecoilState(uploadState);
  const setStoryloading = (value: boolean) =>
    setUploadState(prev => ({...prev, story: value}));
  const publishStoryListUpdate = useUpdatePublisher(storyListUpdate);

  const [isLoading, deleteStory] = useAuthAxios<any>({
    requestOption: {
      method: 'DELETE',
      url: `/v1/galleries/stories/${storyKey}`,
    },
    onResponseSuccess: () => {
      publishStoryListUpdate();
      navigation.navigate('HomeTab', {screen: 'Home'});
    },
    onError: err => {
      Alert.alert('스토리 삭제를 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setStoryloading(isLoading);
  }, [isLoading]);

  const submit = function () {
    deleteStory({
      data: {
        storyKey: storyKey,
      },
    });
  };

  return [
    () => {
      submit();
    },
  ];
};
export const useDeleteGallery = ({galleryId}: GalleryProps): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setUploadState = useSetRecoilState(uploadState);
  const setStoryloading = (value: boolean) =>
    setUploadState(prev => ({...prev, story: value}));

  const [isLoading, deleteStory] = useAuthAxios<any>({
    requestOption: {
      method: 'DELETE',
      url: `/v1/galleries/${galleryId}`,
    },
    onResponseSuccess: () => {
      navigation.navigate('HomeTab', {screen: 'Home'});
    },
    onError: err => {
      Alert.alert('사진 삭제를 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setStoryloading(isLoading);
  }, [isLoading]);

  const submit = function () {
    deleteStory({
      data: {
        galleryId: galleryId,
      },
    });
  };

  return [
    () => {
      submit();
    },
  ];
};
