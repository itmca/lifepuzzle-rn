import { useUIStore } from '../../stores/ui.store';
import { useAuthAxios } from '../core/auth-http.hook';
import { Alert } from 'react-native';
import { useUpdatePublisher } from '../common/update.hook';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../navigation/types';
import { useEffect } from 'react';
import { useMediaStore } from '../../stores/media.store';
import { useSelectionStore } from '../../stores/selection.store';

type Props = {
  storyKey: string;
  galleryId?: number;
};
type GalleryProps = {
  galleryId: number;
};
export const useDeleteStory = ({
  storyKey,
  galleryId,
}: Props): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setUploadState = useUIStore(state => state.setUploadState);
  const setStoryloading = (value: boolean) => setUploadState({ story: value });
  const publishStoryListUpdate = useUpdatePublisher('storyListUpdate');
  const { updateGalleryStory } = useMediaStore.getState();

  const [isLoading, deleteStory] = useAuthAxios<any>({
    requestOption: {
      method: 'DELETE',
      url: `/v1/galleries/stories/${storyKey}`,
    },
    onResponseSuccess: () => {
      if (galleryId) {
        updateGalleryStory(galleryId, null);
      }
      publishStoryListUpdate();
      navigation.goBack();
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
export const useDeleteGallery = ({ galleryId }: GalleryProps): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setUploadState = useUIStore(state => state.setUploadState);
  const setStoryloading = (value: boolean) => setUploadState({ story: value });
  const selectionStore = useSelectionStore.getState();

  const [isLoading, deleteStory] = useAuthAxios<any>({
    requestOption: {
      method: 'DELETE',
      url: `/v1/galleries/${galleryId}`,
    },
    onResponseSuccess: () => {
      const mediaState = useMediaStore.getState();
      const allGalleryBefore = mediaState.gallery;
      const removedIndex = allGalleryBefore.findIndex(
        item => item.id === galleryId,
      );

      mediaState.removeGalleryItem(galleryId);
      const { gallery: updatedGallery } = useMediaStore.getState();
      const filteredGallery = updatedGallery.filter(
        item => item.tag?.key !== 'AI_PHOTO',
      );

      if (filteredGallery.length === 0) {
        navigation.navigate('App', { screen: 'Home' });
        return;
      }

      const nextTarget =
        updatedGallery.find(
          (item, index) =>
            index >= removedIndex && item.tag?.key !== 'AI_PHOTO',
        ) ?? filteredGallery[filteredGallery.length - 1];

      const nextIndex = updatedGallery.findIndex(
        item => item.id === nextTarget.id,
      );
      if (nextIndex >= 0) {
        selectionStore.setCurrentGalleryIndex(nextIndex);
      }

      navigation.goBack();
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
