import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  FlashList,
  FlashListRef,
  ListRenderItemInfo as FlashListRenderItemInfo,
} from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';

import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../../components/ui/layout/ContentContainer.tsx';
import { ApiErrorFallback } from '../../../../components/ui/feedback/ApiErrorFallback';
import { useMediaStore } from '../../../../stores/media.store';
import { useSelectionStore } from '../../../../stores/selection.store';
import { useAuthStore } from '../../../../stores/auth.store';
import {
  GalleryType,
  TagKey,
  TagType,
} from '../../../../types/core/media.type';
import { BasicNavigationProps } from '../../../../navigation/types.tsx';
import { useTagSelection } from '../../../../hooks/useTagSelection';
import { Color } from '../../../../constants/color.constant.ts';
import { useRenderLog } from '../../../../utils/debug/render-log.util';

import { BodyTextM, Title } from '../../../../components/ui/base/TextBase';
import GalleryTag from './GalleryTag.tsx';
import { AdaptiveImage } from '../../../../components/ui/base/ImageBase';
import Video from 'react-native-video';
import VideoModal from '../../../../components/ui/interaction/VideoModal';
import { useGalleryQueryContext } from '../../contexts/gallery-query.context';

type props = {
  onScrollYChange?: (offsetY: number) => void;
};

const Gallery = ({ onScrollYChange }: props): React.ReactElement => {
  // Refs
  const tagScrollRef = useRef<ScrollView>(null);
  const horizontalListRef = useRef<FlatList<TagKey>>(null);
  const gridRefs = useRef<
    Partial<Record<TagKey, FlashListRef<GalleryType> | null>>
  >({});
  const isTagClickScrolling = useRef(false);
  const tagWidthsRef = useRef<number[]>([]);
  const tagOffsetsRef = useRef<number[]>([]);
  const layoutCompletedRef = useRef<boolean>(false);

  // React hooks
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUri, setVideoUri] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 글로벌 상태 관리 (Zustand)
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);
  const gallery = useMediaStore(state => state.gallery);
  const setGalleryError = useMediaStore(state => state.setGalleryError);
  const setSelectedTag = useSelectionStore(state => state.setSelectedTag);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());
  const { isError, hasInitialData, refetch } = useGalleryQueryContext();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const { selectedTag, handleTagPress: handleTagPressBase } = useTagSelection({
    tags: tags ?? [],
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // Debug: 렌더링 추적
  useRenderLog('Gallery', {
    tagsCount: tags?.length,
    selectedTagKey: selectedTag?.key,
    galleryCount: gallery?.length,
    isRefreshing,
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
    if (index === -1) {
      return;
    }

    // Scroll tag ScrollView to selected tag
    if (tagScrollRef.current && tagOffsetsRef.current.length > 0) {
      const offset = tagOffsetsRef.current[index];
      if (offset !== undefined) {
        tagScrollRef.current.scrollTo({
          x: offset,
          animated: true,
        });
      }
    }

    // Scroll horizontal gallery FlatList
    if (horizontalListRef.current) {
      try {
        horizontalListRef.current.scrollToIndex({
          index,
          animated: true,
        });
      } catch {
        // ignore occasional out of range errors while list is mounting
      }
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
      if (!tags) return;

      isTagClickScrolling.current = true;
      handleTagPressBase(index);

      // Scroll tag ScrollView to selected tag
      if (tagScrollRef.current && tagOffsetsRef.current.length > 0) {
        const offset = tagOffsetsRef.current[index];
        if (offset !== undefined) {
          tagScrollRef.current.scrollTo({
            x: offset,
            animated: true,
          });
        }
      }

      horizontalListRef.current?.scrollToIndex({ index, animated: true });
      const list = gridRefs.current[tags[index].key as TagKey];
      list?.scrollToOffset({ offset: 0, animated: true });
      onScrollYChange?.(0);
    },
    [handleTagPressBase, onScrollYChange, tags],
  );

  const handleTagLayout = useCallback(
    (index: number, event: any) => {
      if (!tags) return;

      const { x, width } = event.nativeEvent.layout;
      tagWidthsRef.current[index] = width;
      tagOffsetsRef.current[index] = x;

      // Check if all layouts are complete
      if (
        !layoutCompletedRef.current &&
        tagOffsetsRef.current.length === tags.length &&
        tagOffsetsRef.current.every(offset => offset !== undefined)
      ) {
        layoutCompletedRef.current = true;

        // Scroll to selected tag after layout is complete
        if (selectedTag?.key) {
          const selectedIndex = tags.findIndex(
            item => item.key === selectedTag.key,
          );
          if (selectedIndex !== -1 && tagScrollRef.current) {
            setTimeout(() => {
              const offset = tagOffsetsRef.current[selectedIndex];
              if (offset !== undefined) {
                tagScrollRef.current?.scrollTo({
                  x: offset,
                  animated: false,
                });
              }
            }, 100);
          }
        }
      }
    },
    [tags, selectedTag],
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

      // 일반 갤러리 아이템 클릭 처리
      if (!isLoggedIn) {
        Alert.alert(
          '로그인이 필요합니다',
          '이 기능을 사용하려면 로그인이 필요합니다.',
        );
        return;
      }

      const allGallery = gallery ?? [];
      const allGalleryIndex = allGallery.findIndex(
        galleryItem => galleryItem.id === item.id,
      );

      navigation.navigate('App', {
        screen: 'StoryViewNavigator',
        params: {
          screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
          params: {
            galleryIndex: allGalleryIndex !== -1 ? allGalleryIndex : 0,
          },
        },
      });
    },
    [gallery, isLoggedIn, navigation],
  );

  const renderGalleryItem = useCallback(
    (tagKey: TagKey, totalItems: number) =>
      ({ item }: FlashListRenderItemInfo<GalleryType>) => {
        const isAiTag = tagKey === 'AI_PHOTO';
        const isSingleItem = totalItems === 1;

        // Full-width: 1개 항목일 때만
        const isFullWidth = isSingleItem;

        // Spacing refinements: paddingHorizontal: 12, marginHorizontal: 6 (12px gap between columns)
        const containerPadding = 12 * 2;
        const itemMargin = 6;
        const availableWidth = windowWidth - containerPadding;
        const itemWidth = isFullWidth
          ? availableWidth - itemMargin * 2
          : (availableWidth - itemMargin * 4) / 2;

        // Height calculation: all items use 1:1 ratio
        const itemHeight = itemWidth;

        return (
          <TouchableOpacity
            onPress={() => handleGalleryItemPress(item, isAiTag)}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 12,
              marginHorizontal: 2,
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {isAiTag ? (
              <Video
                source={{ uri: item.url }}
                style={{
                  width: '100%',
                  aspectRatio: 1,
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
                  aspectRatio: 1,
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
          paddingHorizontal={12}
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
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item: GalleryType) => `${tagKey}-${item.id}`}
            contentContainerStyle={{
              paddingBottom: 84,
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                progressBackgroundColor="#ffffff"
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
            ListEmptyComponent={
              (() => (
                <ContentContainer alignCenter paddingVertical={60} gap={8}>
                  <Title color={Color.GREY_400}>사진이 없습니다</Title>
                  <BodyTextM color={Color.GREY_300}>
                    새로운 추억을 추가해보세요
                  </BodyTextM>
                </ContentContainer>
              )) as React.ComponentType<any>
            }
          />
        </ContentContainer>
      );
    },
    [
      ageGroups,
      handleScroll,
      isRefreshing,
      handleRefresh,
      renderGalleryItem,
      windowWidth,
    ],
  );

  if (shouldShowError) {
    return (
      <ApiErrorFallback
        title="데이터를 불러올 수 없습니다"
        message="네트워크 연결을 확인하고 다시 시도해주세요."
        onRetry={refetch}
        retryText="다시 시도"
      />
    );
  }

  return (
    <>
      <ContentContainer flex={1} gap={12}>
        <ContentContainer paddingLeft={20}>
          <ScrollContentContainer
            ref={tagScrollRef}
            useHorizontalLayout
            gap={6}
            paddingRight={20}
          >
            {tags?.map((item: TagType, index) => {
              return (
                <GalleryTag
                  key={item.key || index}
                  item={item}
                  index={index}
                  selectedTag={selectedTag}
                  onPress={handleTagPress}
                  onLayout={event => handleTagLayout(index, event)}
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

export default React.memo(Gallery);
