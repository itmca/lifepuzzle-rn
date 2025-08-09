import {useState, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {SkImage} from '@shopify/react-native-skia';
import {BasicNavigationProps} from '../../navigation/types';
import {selectedGalleryIndexState} from '../../recoils/photos.recoil';
import {editedGalleryItemsState} from '../../recoils/gallery-write.recoil';
import {FilterType, FILTER_SETTINGS} from '../../constants/filter.constant';
import {
  applyFilterToImage,
  saveFilteredImageToCache,
} from '../image-filter.service';
import {CustomAlert} from '../../components/alert/CustomAlert';

export const useFilterOperations = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('original');
  const [filterAmount, setFilterAmount] = useState(1);
  const [galleryIndex] = useRecoilState(selectedGalleryIndexState);
  const [editGalleryItems, setEditGalleryItems] = useRecoilState(
    editedGalleryItemsState,
  );
  const navigation = useNavigation<BasicNavigationProps>();

  const isSliderNeeded = FILTER_SETTINGS[activeFilter] !== undefined;
  const currentSliderConfig = FILTER_SETTINGS[activeFilter];

  const applyFilter = useCallback(
    (filterName: FilterType, selectedImage?: PhotoIdentifier) => {
      if (!selectedImage) {
        CustomAlert.simpleAlert('먼저 사진을 선택해주세요.');
        return;
      }
      setActiveFilter(filterName);
      const initialAmount = applyFilterToImage(filterName);
      setFilterAmount(initialAmount);
    },
    [],
  );

  const saveFilteredImage = useCallback(
    async (
      canvasRef: any,
      skiaImage: SkImage | null,
      selectedImage?: PhotoIdentifier,
    ) => {
      if (!canvasRef.current || !skiaImage) {
        CustomAlert.simpleAlert('저장할 사진이 없습니다.');
        return;
      }

      if (!selectedImage) {
        CustomAlert.simpleAlert('선택된 이미지가 없습니다.');
        return;
      }

      try {
        const snapshot = canvasRef.current.makeImageSnapshot();
        const newImageObject = await saveFilteredImageToCache(
          snapshot,
          skiaImage,
          selectedImage,
        );

        const updatedGallery = editGalleryItems.map((e, idx) =>
          idx === galleryIndex ? newImageObject : e,
        );
        setEditGalleryItems(updatedGallery);
        navigation.goBack();
      } catch (err) {
        console.error('필터 저장 오류:', err);
      }
    },
    [editGalleryItems, galleryIndex, setEditGalleryItems, navigation],
  );

  return {
    activeFilter,
    filterAmount,
    setFilterAmount,
    isSliderNeeded,
    currentSliderConfig,
    applyFilter,
    saveFilteredImage,
  };
};
