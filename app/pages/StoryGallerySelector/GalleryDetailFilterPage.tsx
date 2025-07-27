import {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {useRecoilState} from 'recoil';
import {selectedGalleryIndexState} from '../../recoils/photos.recoil.ts';
import {editedGalleryItemsState} from '../../recoils/gallery-write.recoil.ts';
import Slider from '@react-native-community/slider';
import RNFS, {writeFile} from 'react-native-fs';
import {encode as encodeBase64} from 'base64-arraybuffer';
import PhotoManipulator from 'react-native-photo-manipulator';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {
  Canvas,
  SkImage,
  Image as SkiaImage,
  ColorMatrix,
  Blur,
  useCanvasRef,
  Skia,
} from '@shopify/react-native-skia';
import {LoadingContainer} from '../../components/loadding/LoadingContainer.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import {TopBar} from '../../components/styled/components/TopBar.tsx';
import WritingHeaderRight from '../../components/header/WritingHeaderRight.tsx';
import {Title} from '../../components/styled/components/Text.tsx';
import {CustomAlert} from '../../components/alert/CustomAlert.tsx';
import {Color} from '../../constants/color.constant.ts';
import {
  FILTER_LABELS,
  FILTER_EFFECTS,
  FILTER_SETTINGS,
  FilterType,
} from '../../constants/filter.constant.ts';

const {width: screenWidth} = Dimensions.get('window');
const displaySize = screenWidth;

const getImageSizeAsync = (
  uri: string,
): Promise<{width: number; height: number}> =>
  new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({width, height}),
      error => reject(error),
    );
  });

async function copyContentUriToFile(
  selectedImage: PhotoIdentifier,
): Promise<string> {
  const uri = selectedImage.node.image.uri;
  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    const dest = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.jpg`;
    await RNFS.copyFile(uri, dest);
    return `file://${dest}`;
  }
  if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
    const {width = 1000, height = 1000} = selectedImage?.node.image ?? {};
    const manipulatedPath = await PhotoManipulator.crop(uri, {
      x: 0,
      y: 0,
      width,
      height,
    });
    return manipulatedPath;
  }
  return uri;
}

async function loadSkiaImage(uri: string): Promise<SkImage | null> {
  try {
    const response = await fetch(uri);
    const buffer = await response.arrayBuffer();
    const skData = Skia.Data.fromBytes(new Uint8Array(buffer));
    const skImage = Skia.Image.MakeImageFromEncoded(skData);
    return skImage ?? null;
  } catch (err) {
    console.warn('Skia image load error', err);
    return null;
  }
}

const GalleryDetailFilterPage = (): JSX.Element => {
  const canvasRef = useCanvasRef();

  const [skiaImage, setSkiaImage] = useState<SkImage | null>(null);
  const [imageSize, setImageSize] = useState({
    width: displaySize,
    height: displaySize,
  });
  const [activeFilter, setActiveFilter] = useState<FilterType>('original');
  const [filterAmount, setFilterAmount] = useState(1);

  const [galleryIndex, setGalleryIndex] = useRecoilState(
    selectedGalleryIndexState,
  );
  const [editGalleryItems, setEditGalleryItems] = useRecoilState(
    editedGalleryItemsState,
  );
  const [selectedImage, setSelectedImage] = useState<
    PhotoIdentifier | undefined
  >(editGalleryItems[galleryIndex]);

  const navigation = useNavigation<BasicNavigationProps>();

  const isSliderNeeded = FILTER_SETTINGS[activeFilter] !== undefined;
  const currentSliderConfig = FILTER_SETTINGS[activeFilter];

  const applyFilter = (filterName: FilterType) => {
    if (!selectedImage) {
      CustomAlert.simpleAlert('먼저 사진을 선택해주세요.');
      return;
    }
    setActiveFilter(filterName);

    const config = FILTER_SETTINGS[filterName];
    setFilterAmount(config ? config.initial : 1);
  };

  const saveFilteredImage = useCallback(async () => {
    if (!canvasRef.current || !skiaImage) {
      CustomAlert.simpleAlert('저장할 사진이 없습니다.');
      return;
    }

    try {
      const snapshot = canvasRef.current.makeImageSnapshot();
      const bytes = snapshot.encodeToBytes();
      const fileName = `filtered_${Date.now()}.png`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await writeFile(filePath, encodeBase64(bytes.buffer), 'base64');

      const newImageObject = {
        ...selectedImage!,
        node: {
          ...selectedImage!.node,
          image: {
            ...selectedImage!.node.image,
            uri: 'file://' + filePath,
            width: skiaImage.width(),
            height: skiaImage.height(),
            size: bytes.length,
            filename: fileName,
          },
        },
      };

      const updatedGallery = editGalleryItems.map((e, idx) =>
        idx === galleryIndex ? newImageObject : e,
      );
      setEditGalleryItems(updatedGallery);
      navigation.goBack();
    } catch (err) {
      console.error('필터 저장 오류:', err);
    }
  }, [
    canvasRef,
    skiaImage,
    selectedImage,
    editGalleryItems,
    galleryIndex,
    setEditGalleryItems,
    navigation,
  ]);

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

        const aspectRatio = width / height;
        setImageSize({width: displaySize, height: displaySize / aspectRatio});
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

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <TopBar
          title={'사진 편집'}
          right={
            <WritingHeaderRight
              text={'완료'}
              customAction={saveFilteredImage}
              disable={!selectedImage || activeFilter === 'original'}
            />
          }
        />
      ),
    });
  }, [navigation, saveFilteredImage, selectedImage, activeFilter]);

  return (
    <LoadingContainer isLoading={false}>
      <ScreenContainer gap={0}>
        <ContentContainer alignCenter flex={1}>
          {!skiaImage ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: displaySize,
              }}>
              <ActivityIndicator size="large" color={Color.GREY} />
            </View>
          ) : (
            <Canvas
              ref={canvasRef}
              style={{
                width: imageSize.width,
                height: imageSize.height,
              }}>
              <SkiaImage
                image={skiaImage}
                x={0}
                y={0}
                width={imageSize.width}
                height={imageSize.height}
                fit="contain">
                {activeFilter === 'blur' && <Blur blur={filterAmount} />}
                {Object.keys(FILTER_EFFECTS).includes(activeFilter) &&
                  typeof FILTER_EFFECTS[activeFilter] !== 'function' && (
                    <ColorMatrix
                      matrix={FILTER_EFFECTS[activeFilter] as number[]}
                    />
                  )}
                {(activeFilter === 'brightness' ||
                  activeFilter === 'contrast' ||
                  activeFilter === 'saturation' ||
                  activeFilter === 'exposure') && (
                  <ColorMatrix
                    matrix={(
                      FILTER_EFFECTS[activeFilter] as (
                        amount: number,
                      ) => number[]
                    )(filterAmount)}
                  />
                )}
              </SkiaImage>
            </Canvas>
          )}
        </ContentContainer>

        <ContentContainer minHeight={40}>
          {isSliderNeeded && currentSliderConfig && (
            <Slider
              minimumValue={currentSliderConfig.min}
              maximumValue={currentSliderConfig.max}
              step={currentSliderConfig.step}
              value={filterAmount}
              onValueChange={setFilterAmount}
              minimumTrackTintColor={Color.MAIN}
              maximumTrackTintColor={Color.GREY}
              thumbTintColor={Color.MAIN}
            />
          )}
        </ContentContainer>

        <ContentContainer
          useHorizontalLayout
          withContentPadding
          style={{paddingVertical: 10}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.keys(FILTER_LABELS).map(filterName => (
              <TouchableOpacity
                key={filterName}
                style={[
                  {
                    width: 80,
                    height: 80,
                    marginRight: 10,
                    borderColor:
                      activeFilter === filterName ? Color.MAIN : Color.GREY,
                    borderWidth: 2,
                    borderRadius: 5,
                  },
                ]}
                onPress={() => applyFilter(filterName)}>
                <ContentContainer borderRadius={5} alignCenter flex={1}>
                  <Title>{FILTER_LABELS[filterName as FilterType]}</Title>
                </ContentContainer>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};

export default GalleryDetailFilterPage;
