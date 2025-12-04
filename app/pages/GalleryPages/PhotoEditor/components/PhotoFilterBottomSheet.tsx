import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import RNFS, { writeFile } from 'react-native-fs';
import { encode as encodeBase64 } from 'base64-arraybuffer';
import { ExtendedPhotoIdentifier } from '../../../../types/ui/photo-selector.type';
import {
  Canvas,
  ColorMatrix,
  Image as SkiaImage,
  SkImage,
  useCanvasRef,
} from '@shopify/react-native-skia';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { Title } from '../../../../components/ui/base/TextBase';
import { CustomAlert } from '../../../../components/ui/feedback/CustomAlert';
import { Color } from '../../../../constants/color.constant.ts';
import { MAX_BOTTOM_SHEET_IMAGE_HEIGHT } from '../../../../constants/carousel.constant.ts';
import {
  FILTER_EFFECTS,
  FILTER_LABELS,
  FilterType,
} from '../../../../constants/filter.constant.ts';
import BottomSheet from '../../../../components/ui/interaction/BottomSheet';
import { loadSkiaImage } from '../../../../services/image/skia-image-loader.service';
import {
  copyContentUriToFile,
  getImageSizeAsync,
} from '../../../../services/image/platform-image.service';
import logger from '../../../../utils/logger';

const { width: screenWidth } = Dimensions.get('window');
const displaySize = screenWidth - 40; // 패딩 고려

type Props = {
  opened: boolean;
  selectedImage: ExtendedPhotoIdentifier | undefined;
  onClose: () => void;
  onApply: (filter: FilterType, filteredUri?: string) => void;
};

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
  const appliedFilter = selectedImage?.appliedFilter ?? 'original';
  const isApplyDisabled =
    !skiaImage || activeFilter === appliedFilter || !selectedImage;

  const handleClose = useCallback(() => {
    setActiveFilter('original');
    onClose();
  }, [onClose]);

  const handleApply = useCallback(async () => {
    if (activeFilter === 'original') {
      onApply('original');
      handleClose();
      return;
    }

    if (!canvasRef.current || !skiaImage) {
      CustomAlert.simpleAlert('저장할 사진이 없습니다.');
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

      onApply(activeFilter, 'file://' + filePath);
      handleClose();
    } catch (err) {
      logger.error('Filter save error:', err);
      CustomAlert.simpleAlert('필터 적용 중 오류가 발생했습니다.');
    }
  }, [activeFilter, canvasRef, skiaImage, onApply, handleClose]);

  // Custom functions
  const applyFilter = (filterName: FilterType) => {
    if (!selectedImage) {
      CustomAlert.simpleAlert('먼저 사진을 선택해주세요.');
      return;
    }
    setActiveFilter(filterName);
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
        const finalHeight = Math.min(
          calculatedHeight,
          MAX_BOTTOM_SHEET_IMAGE_HEIGHT,
        );
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
          const img = await loadSkiaImage(path);

          setSkiaImage(img);
        } catch (error) {
          logger.error(
            '[PhotoFilterBottomSheet] Failed to load image for filter:',
            error,
          );
          CustomAlert.simpleAlert('이미지를 불러오는데 실패했습니다.');
        }
      }
    })();
  }, [selectedImage, opened]);

  useEffect(() => {
    if (opened) {
      setActiveFilter(selectedImage?.appliedFilter ?? 'original');
      return;
    }
    setSkiaImage(null);
  }, [opened, selectedImage]);

  return (
    <BottomSheet
      title="필터"
      snapPoints={['80%']}
      opened={opened}
      onClose={handleClose}
      headerPaddingBottom={8}
      paddingBottom={12}
    >
      <ContentContainer gap={12} flex={1}>
        {/* 이미지 프리뷰 영역 */}
        <ContentContainer alignCenter flex={1} paddingTop={12}>
          {!skiaImage ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: MAX_BOTTOM_SHEET_IMAGE_HEIGHT,
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
                  maxHeight: MAX_BOTTOM_SHEET_IMAGE_HEIGHT,
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
                  {activeFilter !== 'original' && (
                    <ColorMatrix
                      matrix={Array.from(
                        FILTER_EFFECTS[activeFilter] as readonly number[],
                      )}
                    />
                  )}
                </SkiaImage>
              </Canvas>
            </View>
          )}
        </ContentContainer>

        {/* 필터 선택 영역 */}
        <ContentContainer paddingVertical={8}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.keys(FILTER_LABELS).map(filterName => {
              const filter = filterName as FilterType;
              const isActive = activeFilter === filter;

              return (
                <TouchableOpacity
                  key={filterName}
                  style={{
                    marginRight: 12,
                    alignItems: 'center',
                  }}
                  onPress={() => applyFilter(filter)}
                >
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 8,
                      overflow: 'hidden',
                      borderWidth: 2,
                      borderColor: isActive ? Color.MAIN : Color.GREY_300,
                    }}
                  >
                    {skiaImage ? (
                      <Canvas
                        style={{
                          width: 70,
                          height: 70,
                        }}
                      >
                        <SkiaImage
                          image={skiaImage}
                          x={0}
                          y={0}
                          width={70}
                          height={70}
                          fit="cover"
                        >
                          {filter !== 'original' && (
                            <ColorMatrix
                              matrix={Array.from(
                                FILTER_EFFECTS[filter] as readonly number[],
                              )}
                            />
                          )}
                        </SkiaImage>
                      </Canvas>
                    ) : (
                      <View
                        style={{
                          width: 70,
                          height: 70,
                          backgroundColor: Color.GREY_100,
                        }}
                      />
                    )}
                  </View>
                  <Title
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: isActive ? Color.MAIN : Color.GREY_700,
                    }}
                  >
                    {FILTER_LABELS[filter]}
                  </Title>
                </TouchableOpacity>
              );
            })}
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
              disabled={isApplyDisabled}
            >
              적용
            </Button>
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
    </BottomSheet>
  );
};
