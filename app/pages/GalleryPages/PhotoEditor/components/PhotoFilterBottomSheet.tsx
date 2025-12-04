import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import logger from '../../../../utils/logger';
import Slider from '@react-native-community/slider';
import RNFS, { writeFile } from 'react-native-fs';
import { encode as encodeBase64 } from 'base64-arraybuffer';
import PhotoManipulator from 'react-native-photo-manipulator';
import { ExtendedPhotoIdentifier } from '../../../../types/ui/photo-selector.type';
import {
  Blur,
  Canvas,
  ColorMatrix,
  Image as SkiaImage,
  Skia,
  SkImage,
  useCanvasRef,
} from '@shopify/react-native-skia';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { Title } from '../../../../components/ui/base/TextBase';
import { CustomAlert } from '../../../../components/ui/feedback/CustomAlert';
import { Color } from '../../../../constants/color.constant.ts';
import {
  FILTER_EFFECTS,
  FILTER_LABELS,
  FILTER_SETTINGS,
  FilterType,
} from '../../../../constants/filter.constant.ts';
import BottomSheet from '../../../../components/ui/interaction/BottomSheet.tsx';
import { Button } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');
const displaySize = screenWidth - 40; // 패딩 고려
const MAX_IMAGE_HEIGHT = 340; // 버튼 영역 확보를 위해 줄임

type Props = {
  opened: boolean;
  selectedImage: ExtendedPhotoIdentifier | undefined;
  onClose: () => void;
  onApply: (filteredUri: string) => void;
};

const getImageSizeAsync = (
  uri: string,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      error => reject(error),
    );
  });

async function copyContentUriToFile(
  selectedImage: ExtendedPhotoIdentifier,
): Promise<string> {
  const uri = selectedImage.node.image.uri;
  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    const dest = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.jpg`;
    await RNFS.copyFile(uri, dest);
    return `file://${dest}`;
  }
  if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
    const { width = 1000, height = 1000 } = selectedImage?.node.image ?? {};
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
    logger.warn('Skia image load error', err);
    return null;
  }
}

export const PhotoFilterBottomSheet = ({
  opened,
  selectedImage,
  onClose,
  onApply,
}: Props): React.ReactElement => {
  // Refs
  const canvasRef = useCanvasRef();

  // React hooks
  const [skiaImage, setSkiaImage] = useState<SkImage | null>(null);
  const [imageSize, setImageSize] = useState({
    width: displaySize,
    height: displaySize,
  });
  const [activeFilter, setActiveFilter] = useState<FilterType>('original');
  const [filterAmount, setFilterAmount] = useState(1);

  // Memoized 값
  const isSliderNeeded = FILTER_SETTINGS[activeFilter] !== undefined;
  const currentSliderConfig = FILTER_SETTINGS[activeFilter];

  const handleClose = useCallback(() => {
    setActiveFilter('original');
    setFilterAmount(1);
    onClose();
  }, [onClose]);

  const handleApply = useCallback(async () => {
    if (!canvasRef.current || !skiaImage) {
      CustomAlert.simpleAlert('저장할 사진이 없습니다.');
      return;
    }

    if (activeFilter === 'original') {
      CustomAlert.simpleAlert('필터를 선택해주세요.');
      return;
    }

    try {
      const snapshot = canvasRef.current.makeImageSnapshot();
      const bytes = snapshot.encodeToBytes();
      const fileName = `filtered_${Date.now()}.png`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await writeFile(
        filePath,
        encodeBase64(bytes.buffer as ArrayBuffer),
        'base64',
      );

      onApply('file://' + filePath);
      handleClose();
    } catch (err) {
      logger.error('Filter save error:', err);
      CustomAlert.simpleAlert('필터 적용 중 오류가 발생했습니다.');
    }
  }, [canvasRef, skiaImage, activeFilter, onApply, handleClose]);

  // Custom functions
  const applyFilter = (filterName: FilterType) => {
    if (!selectedImage) {
      CustomAlert.simpleAlert('먼저 사진을 선택해주세요.');
      return;
    }
    setActiveFilter(filterName);

    const config = FILTER_SETTINGS[filterName];
    setFilterAmount(config ? config.initial : 1);
  };

  // Side effects
  useEffect(() => {
    const fetchImageSize = async () => {
      if (selectedImage?.node.image.uri) {
        // 원본 이미지 URI 우선 사용
        const imageUri =
          selectedImage.originalUri ?? selectedImage.node.image.uri;
        let width = selectedImage.node.image.width;
        let height = selectedImage.node.image.height;

        if (!width || !height) {
          try {
            const size = await getImageSizeAsync(imageUri);
            width = size.width;
            height = size.height;
          } catch {
            setImageSize({ width: displaySize, height: displaySize });
            return;
          }
        }

        const aspectRatio = width / height;
        const calculatedHeight = displaySize / aspectRatio;
        const finalHeight = Math.min(calculatedHeight, MAX_IMAGE_HEIGHT);
        const finalWidth = finalHeight * aspectRatio;
        setImageSize({ width: finalWidth, height: finalHeight });
      } else {
        setImageSize({ width: displaySize, height: displaySize });
      }
    };

    void fetchImageSize();
  }, [selectedImage]);

  useEffect(() => {
    (async () => {
      if (selectedImage?.node.image.uri && opened) {
        try {
          // 원본 이미지 URI를 우선 사용 (필터가 적용된 경우 originalUri 사용)
          const imageUri =
            selectedImage.originalUri ?? selectedImage.node.image.uri;
          logger.debug('Loading image for filter:', imageUri);

          // 원본 URI를 사용하도록 임시 객체 생성
          const imageToLoad = selectedImage.originalUri
            ? {
                ...selectedImage,
                node: {
                  ...selectedImage.node,
                  image: {
                    ...selectedImage.node.image,
                    uri: selectedImage.originalUri,
                  },
                },
              }
            : selectedImage;

          const path = await copyContentUriToFile(imageToLoad);
          logger.debug('Copied to path:', path);
          const img = await loadSkiaImage(path);
          logger.debug('Skia image loaded:', img ? 'success' : 'failed');
          setSkiaImage(img);
        } catch (error) {
          logger.error('Failed to load image for filter:', error);
          CustomAlert.simpleAlert('이미지를 불러오는데 실패했습니다.');
        }
      }
    })();
  }, [selectedImage, opened]);

  // 바텀시트 닫힐 때 상태 초기화
  useEffect(() => {
    if (!opened) {
      setActiveFilter('original');
      setFilterAmount(1);
      setSkiaImage(null);
    }
  }, [opened]);

  return (
    <BottomSheet
      title="필터"
      snapPoints={['80%']}
      opened={opened}
      onClose={handleClose}
      headerPaddingBottom={8}
      paddingBottom={12}
    >
      <ContentContainer gap={8} flex={1}>
        {/* 이미지 프리뷰 영역 */}
        <ContentContainer alignCenter flex={1} paddingTop={16}>
          {!skiaImage ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: MAX_IMAGE_HEIGHT,
              }}
            >
              <ActivityIndicator size="large" color={Color.GREY} />
            </View>
          ) : (
            <View
              style={{
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <Canvas
                ref={canvasRef}
                style={{
                  width: imageSize.width,
                  height: imageSize.height,
                  maxHeight: MAX_IMAGE_HEIGHT,
                }}
              >
                <SkiaImage
                  image={skiaImage}
                  x={0}
                  y={0}
                  width={imageSize.width}
                  height={imageSize.height}
                  fit="contain"
                >
                  {activeFilter === 'blur' && <Blur blur={filterAmount} />}
                  {Object.keys(FILTER_EFFECTS).includes(activeFilter) &&
                    activeFilter !== 'blur' &&
                    typeof FILTER_EFFECTS[
                      activeFilter as keyof typeof FILTER_EFFECTS
                    ] !== 'function' && (
                      <ColorMatrix
                        matrix={Array.from(
                          FILTER_EFFECTS[
                            activeFilter as keyof typeof FILTER_EFFECTS
                          ] as readonly number[],
                        )}
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
            </View>
          )}
        </ContentContainer>

        {/* 슬라이더 영역 */}
        <ContentContainer minHeight={40} paddingBottom={4}>
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

        {/* 필터 선택 영역 */}
        <ContentContainer paddingVertical={8}>
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
                onPress={() => applyFilter(filterName as FilterType)}
              >
                <ContentContainer borderRadius={5} alignCenter flex={1}>
                  <Title>{FILTER_LABELS[filterName as FilterType]}</Title>
                </ContentContainer>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ContentContainer>

        {/* 버튼 영역 */}
        <ContentContainer
          useHorizontalLayout
          gap={12}
          paddingTop={16}
          paddingBottom={8}
        >
          <ContentContainer flex={1}>
            <Button
              mode="outlined"
              onPress={handleClose}
              textColor={Color.GREY_700}
              style={{ borderColor: Color.GREY_300 }}
            >
              취소
            </Button>
          </ContentContainer>
          <ContentContainer flex={1}>
            <Button
              mode="contained"
              onPress={handleApply}
              buttonColor={Color.MAIN}
              disabled={activeFilter === 'original'}
            >
              적용
            </Button>
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
    </BottomSheet>
  );
};
