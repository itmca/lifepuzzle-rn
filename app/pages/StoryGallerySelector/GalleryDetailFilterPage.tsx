import React, {useEffect, useCallback, useMemo} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import Slider from '@react-native-community/slider';
import {
  Canvas,
  Image as SkiaImage,
  ColorMatrix,
  Blur,
  useCanvasRef,
} from '@shopify/react-native-skia';
import {LoadingContainer} from '../../components/loadding/LoadingContainer.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import {TopBar} from '../../components/styled/components/TopBar.tsx';
import WritingHeaderRight from '../../components/header/WritingHeaderRight.tsx';
import {Title} from '../../components/styled/components/Text.tsx';
import {Color} from '../../constants/color.constant.ts';
import {
  FILTER_LABELS,
  FILTER_EFFECTS,
  FilterType,
} from '../../constants/filter.constant.ts';
import {useImageState} from '../../service/hooks/image-state.hook';
import {useFilterOperations} from '../../service/hooks/filter-operations.hook';

const GalleryDetailFilterPage = (): JSX.Element => {
  const canvasRef = useCanvasRef();
  const navigation = useNavigation<BasicNavigationProps>();
  const {skiaImage, imageSize, selectedImage, displaySize} = useImageState();
  const {
    activeFilter,
    filterAmount,
    setFilterAmount,
    isSliderNeeded,
    currentSliderConfig,
    applyFilter,
    saveFilteredImage,
  } = useFilterOperations();

  const handleSaveFilteredImage = useCallback(() => {
    saveFilteredImage(canvasRef, skiaImage, selectedImage);
  }, [saveFilteredImage, canvasRef, skiaImage, selectedImage]);

  const handleApplyFilter = useCallback(
    (filterName: FilterType) => {
      applyFilter(filterName, selectedImage);
    },
    [applyFilter, selectedImage],
  );

  const HeaderComponent = useMemo(
    () => (
      <TopBar
        title={'사진 편집'}
        right={
          <WritingHeaderRight
            text={'완료'}
            customAction={handleSaveFilteredImage}
            disable={!selectedImage || activeFilter === 'original'}
          />
        }
      />
    ),
    [handleSaveFilteredImage, selectedImage, activeFilter],
  );

  useEffect(() => {
    navigation.setOptions({
      header: () => HeaderComponent,
    });
  }, [navigation, HeaderComponent]);

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

        <ContentContainer minHeight="40">
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
                onPress={() => handleApplyFilter(filterName as FilterType)}>
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
