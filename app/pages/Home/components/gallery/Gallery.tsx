import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  FlashList,
  FlashListRef,
  ListRenderItemInfo as FlashListRenderItemInfo,
} from '@shopify/flash-list';

import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../../components/ui/layout/ContentContainer.tsx';
import { useMediaStore } from '../../../../stores/media.store';
import { useSelectionStore } from '../../../../stores/selection.store';
import {
  AgeGroupsType,
  GalleryType,
  TagKey,
  TagType,
} from '../../../../types/core/media.type';
import { useTagSelection } from '../../../../hooks/useTagSelection';
import { Color } from '../../../../constants/color.constant.ts';

import { BodyTextM, Title } from '../../../../components/ui/base/TextBase';
import GalleryTag from './GalleryTag.tsx';
import { BasicButton } from '../../../../components/ui/form/Button';
import { AdaptiveImage } from '../../../../components/ui/base/ImageBase';
import Video from 'react-native-video';
import VideoModal from '../../../../components/ui/interaction/VideoModal';

type props = {
  ageGroups: AgeGroupsType;
  tags: TagType[];
  isError?: boolean;
  hasInitialData?: boolean;
  onRetry?: () => void;
  onScrollYChange?: (offsetY: number) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onItemPress: (item: GalleryType) => void;
};

const Gallery = ({
  ageGroups,
  tags,
  isError = false,
  hasInitialData = false,
  onRetry,
  onScrollYChange,
  isRefreshing,
  onRefresh,
  onItemPress,
}: props): React.ReactElement => {
  // Refs
  const horizontalListRef = useRef<FlatList<TagKey>>(null);
  const gridRefs = useRef<
    Partial<Record<TagKey, FlashListRef<GalleryType> | null>>
  >({});
  const isTagClickScrolling = useRef(false);

  // React hooks
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUri, setVideoUri] = useState<string>('');

  // 글로벌 상태 관리 (Zustand)
  const setGalleryError = useMediaStore(state => state.setGalleryError);
  const setSelectedTag = useSelectionStore(state => state.setSelectedTag);

  // Custom hooks
  const { selectedTag, handleTagPress: handleTagPressBase } = useTagSelection({
    tags,
  });

  // Memoized 값
  const { width: windowWidth } = useWindowDimensions();

  // Memoized default index calculation
  const defaultIndex = useMemo(() => {
    if (!tags || !selectedTag || tags.length === 0) {
      return 0;
    }
    const index = tags.findIndex(item => item.key === selectedTag.key);
    return index < 0 ? 0 : index;
  }, [tags, selectedTag]);

  const ageGroupsArray = useMemo(
    () => (tags && ageGroups ? tags.map(tag => tag.key) : []),
    [ageGroups, tags],
  );

  // Side effects (useEffect 등)
  useEffect(() => {
    if (!selectedTag?.key || !tags?.length) {
      return;
    }

    const index = tags.findIndex(item => item.key === selectedTag.key);
    if (index === -1 || !horizontalListRef.current) {
      return;
    }

    try {
      horizontalListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    } catch {
      // ignore occasional out of range errors while list is mounting
    }

    const targetList = gridRefs.current[tags[index].key as TagKey];
    targetList?.scrollToOffset({ offset: 0, animated: false });
  }, [selectedTag?.key, tags?.length, tags]);

  // 처음 데이터 로딩 시에만 에러 화면 표시
  const shouldShowError = isError && !hasInitialData;

  useEffect(() => {
    setGalleryError(shouldShowError);
  }, [shouldShowError, setGalleryError]);

  const handleTagPress = useCallback(
    (index: number) => {
      isTagClickScrolling.current = true;
      handleTagPressBase(index);
      horizontalListRef.current?.scrollToIndex({ index, animated: true });
      const list = gridRefs.current[tags[index].key as TagKey];
      list?.scrollToOffset({ offset: 0, animated: true });
      onScrollYChange?.(0);
    },
    [handleTagPressBase, onScrollYChange, tags],
  );

  const handleScroll = useCallback(
    (event: any) => {
      onScrollYChange?.(event.nativeEvent.contentOffset.y);
    },
    [onScrollYChange],
  );

  const handleHorizontalMomentumEnd = useCallback(
    (event: any) => {
      if (!tags || tags.length === 0) {
        return;
      }

      // 태그 클릭으로 인한 스크롤인 경우 무시
      if (isTagClickScrolling.current) {
        isTagClickScrolling.current = false;
        return;
      }

      // 사용자 스와이프인 경우만 상태 업데이트
      const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
      const nextTag = tags[index];
      if (nextTag && nextTag.key !== selectedTag?.key) {
        setSelectedTag({ ...nextTag });
      }
    },
    [tags, windowWidth, setSelectedTag, selectedTag?.key],
  );

  const handleGalleryItemPress = useCallback(
    (item: GalleryType, isAiTag: boolean) => {
      if (isAiTag) {
        setVideoUri(item.url);
        setVideoModalOpen(true);
        return;
      }
      onItemPress(item);
    },
    [onItemPress],
  );

  const renderGalleryItem = useCallback(
    (tagKey: TagKey, totalItems: number) =>
      ({ item, index }: FlashListRenderItemInfo<GalleryType>) => {
        const isAiTag = tagKey === 'AI_PHOTO';
        const isLastItem = index === totalItems - 1;
        const isOddCount = totalItems % 2 === 1;
        const isSingleItem = totalItems === 1;

        // Full-width: 1개 항목이거나, 홀수 개수의 마지막 항목
        const isFullWidth = isSingleItem || (isOddCount && isLastItem);

        // paddingHorizontal: 16, marginHorizontal: 6
        const containerPadding = 16 * 2;
        const itemMargin = 6 * 2;
        const availableWidth = windowWidth - containerPadding;
        const itemWidth = isFullWidth
          ? availableWidth - itemMargin
          : availableWidth / 2 - itemMargin;

        return (
          <TouchableOpacity
            onPress={() => handleGalleryItemPress(item, isAiTag)}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 12,
              marginHorizontal: 6,
              width: itemWidth,
            }}
          >
            {isAiTag ? (
              <Video
                source={{ uri: item.url }}
                style={{
                  width: '100%',
                  aspectRatio: 4 / 3,
                  backgroundColor: 'black',
                }}
                paused
                muted
                resizeMode="cover"
              />
            ) : (
              <AdaptiveImage
                uri={item.url}
                style={{
                  width: '100%',
                  aspectRatio: 4 / 3,
                }}
                borderRadius={12}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        );
      },
    [handleGalleryItemPress, windowWidth],
  );

  const renderGridList = useCallback(
    ({ item: tagKey }: { item: TagKey }) => {
      const galleryItems = ageGroups?.[tagKey]?.gallery ?? [];
      return (
        <ContentContainer
          style={{ width: windowWidth }}
          paddingHorizontal={16}
          paddingVertical={8}
          gap={12}
        >
          <FlashList
            ref={ref => {
              gridRefs.current[tagKey as TagKey] = ref;
            }}
            data={galleryItems}
            numColumns={2}
            renderItem={renderGalleryItem(tagKey, galleryItems.length)}
            estimatedItemSize={200}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item: GalleryType) => `${tagKey}-${item.id}`}
            contentContainerStyle={{
              paddingBottom: 60,
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                progressBackgroundColor="#ffffff"
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
            ListEmptyComponent={() => (
              <ContentContainer alignCenter paddingVertical={60} gap={8}>
                <Title color={Color.GREY_400}>사진이 없습니다</Title>
                <BodyTextM color={Color.GREY_300}>
                  새로운 추억을 추가해보세요
                </BodyTextM>
              </ContentContainer>
            )}
          />
        </ContentContainer>
      );
    },
    [
      ageGroups,
      handleScroll,
      isRefreshing,
      onRefresh,
      renderGalleryItem,
      windowWidth,
    ],
  );

  if (shouldShowError) {
    return (
      <ContentContainer
        flex={1}
        justifyContent="center"
        alignItems="center"
        gap={20}
        paddingBottom={40}
      >
        <ContentContainer gap={8} alignCenter>
          <Title color={Color.GREY_400}>인터넷 연결이 잠시 불안정해요</Title>
          <ContentContainer gap={0} alignCenter>
            <BodyTextM color={Color.GREY_300}>
              네트워크를 확인한 뒤 다시 시도해주세요
            </BodyTextM>
          </ContentContainer>
        </ContentContainer>
        <ContentContainer width={120}>
          <BasicButton
            text={'다시 시도'}
            height={48}
            onPress={() => onRetry?.()}
          />
        </ContentContainer>
      </ContentContainer>
    );
  }

  return (
    <>
      <ContentContainer flex={1} gap={12}>
        <ContentContainer paddingLeft={20}>
          <ScrollContentContainer useHorizontalLayout gap={6} paddingRight={20}>
            {tags?.map((item: TagType, index) => {
              return (
                <GalleryTag
                  key={item.key || index}
                  item={item}
                  index={index}
                  selectedTag={selectedTag}
                  onPress={handleTagPress}
                />
              );
            })}
          </ScrollContentContainer>
        </ContentContainer>

        <FlatList
          ref={horizontalListRef}
          data={ageGroupsArray}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleHorizontalMomentumEnd}
          {...(ageGroupsArray.length > 0
            ? { initialScrollIndex: defaultIndex }
            : {})}
          getItemLayout={(_, index) => ({
            index,
            length: windowWidth,
            offset: windowWidth * index,
          })}
          renderItem={renderGridList}
          keyExtractor={(item, index) => `${item}-${index}`}
        />
      </ContentContainer>
      {videoModalOpen && (
        <VideoModal
          opened={videoModalOpen}
          videoUri={videoUri}
          onClose={() => setVideoModalOpen(false)}
        />
      )}
    </>
  );
};

export default Gallery;
