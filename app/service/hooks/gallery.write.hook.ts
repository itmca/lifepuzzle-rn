import {
  IMG_TYPE,
  VIDEO_TYPE,
} from '../../constants/upload-file-type.constant.ts';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {useAuthAxios} from './network.hook.ts';
import {Alert} from 'react-native';
import {
  isGalleryUploadingState,
  selectedGalleryItemsState,
} from '../../recoils/gallery-write.recoil.ts';
import {heroState} from '../../recoils/hero.recoil.ts';
import {TagType} from '../../types/photo.type.ts';
import {selectedTagState} from '../../recoils/photos.recoil.ts';
import {useEffect} from 'react';
import {CustomAlert} from '../../components/alert/CustomAlert.tsx';

export const useUploadGallery = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();

  const hero = useRecoilValue(heroState);
  const selectedTag = useRecoilValue<TagType>(selectedTagState);
  const selectedGalleryItems = useRecoilValue(selectedGalleryItemsState);
  const resetSelectedGalleryItems = useResetRecoilState(
    selectedGalleryItemsState,
  );
  const setIsGalleryUplodaing = useSetRecoilState(isGalleryUploadingState);

  const [isLoading, saveStory] = useAuthAxios<any>({
    requestOption: {
      method: 'post',
      url: '/v1/heroes/gallery',
      headers: {'Content-Type': 'multipart/form-data'},
      timeout: 10_000,
    },
    onResponseSuccess: () => {
      resetSelectedGalleryItems();

      CustomAlert.simpleAlert('업로드 되었습니다.');

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    onError: err => {
      console.log(err);
      Alert.alert('업로드에 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setIsGalleryUplodaing(isLoading);
  }, [isLoading]);

  const submit = function () {
    const galleyHttpPayLoad = new FormData();

    galleyHttpPayLoad.append('galleryInfo', {
      string: JSON.stringify({
        heroId: hero.heroNo,
        ageGroup: selectedTag.key,
      }),
      type: 'application/json',
    });

    selectedGalleryItems.forEach(image => {
      const uri = image.node.image.uri;
      const fileType = image.node.type;
      const fileName = image.node.image.filename || image.node.id || 'image';

      galleyHttpPayLoad.append('gallery', {
        uri,
        type: fileType === 'image' ? IMG_TYPE : VIDEO_TYPE,
        name: fileName,
      });
    });

    saveStory({
      data: galleyHttpPayLoad,
    });
  };

  return [submit, isLoading];
};
