import {useSetRecoilState} from 'recoil';
import {isStoryUploading} from '../../recoils/story-write.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from './update.hooks';
import {storyListUpdate} from '../../recoils/update.recoil';
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
  const setStoryloading = useSetRecoilState(isStoryUploading);
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
  const setStoryloading = useSetRecoilState(isStoryUploading);

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
