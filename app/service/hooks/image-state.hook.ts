import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {SkImage} from '@shopify/react-native-skia';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useRecoilState} from 'recoil';
import {selectedGalleryIndexState} from '../../recoils/photos.recoil';
import {editedGalleryItemsState} from '../../recoils/gallery-write.recoil';
import {
  getImageSizeAsync,
  copyContentUriToFile,
  loadSkiaImage,
  calculateImageDisplaySize,
} from '../image-processing.service';
import {CustomAlert} from '../../components/alert/CustomAlert';

const {width: screenWidth} = Dimensions.get('window');
const displaySize = screenWidth;

export const useImageState = () => {
  const [skiaImage, setSkiaImage] = useState<SkImage | null>(null);
  const [imageSize, setImageSize] = useState({
    width: displaySize,
    height: displaySize,
  });
  const [galleryIndex] = useRecoilState(selectedGalleryIndexState);
  const [editGalleryItems] = useRecoilState(editedGalleryItemsState);
  const [selectedImage, setSelectedImage] = useState<
    PhotoIdentifier | undefined
  >(editGalleryItems[galleryIndex]);

  useEffect(() => {
    if (editGalleryItems && editGalleryItems.length > galleryIndex) {
      setSelectedImage(editGalleryItems[galleryIndex]);
    } else {
      setSelectedImage(undefined);
      CustomAlert.simpleAlert(
        '이미지를 불러올 수 없습니다. 갤러리 항목을 확인해주세요.',
      );
    }
  }, [editGalleryItems, galleryIndex]);

  useEffect(() => {
    const fetchImageSize = async () => {
      if (selectedImage?.node.image.uri) {
        let width = selectedImage.node.image.width;
        let height = selectedImage.node.image.height;

        if (!width || !height) {
          try {
            const size = await getImageSizeAsync(selectedImage.node.image.uri);
            width = size.width;
            height = size.height;
          } catch (e) {
            setImageSize({width: displaySize, height: displaySize});
            return;
          }
        }

        const calculatedSize = calculateImageDisplaySize(
          width,
          height,
          displaySize,
        );
        setImageSize(calculatedSize);
      } else {
        setImageSize({width: displaySize, height: displaySize});
      }
    };

    fetchImageSize();
  }, [selectedImage]);

  useEffect(() => {
    (async () => {
      if (selectedImage?.node.image.uri) {
        const path = await copyContentUriToFile(selectedImage);
        const img = await loadSkiaImage(path);
        setSkiaImage(img);
      }
    })();
  }, [selectedImage]);

  return {
    skiaImage,
    imageSize,
    selectedImage,
    displaySize,
  };
};
