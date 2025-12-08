import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

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
  const horizontalListRef = useRef<FlatList<TagType>>(null);
  const masonryRefs = useRef<
    Partial<Record<TagKey, FlashList<GalleryType> | null>>
  >({});
  const aspectRatioRef = useRef<Record<number, number>>({});
  const isTagClickScrolling = useRef(false);
  const [aspectRatiosVersion, setAspectRatiosVersion] = useState(0);

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
    } catch (error) {
      // ignore occasional out of range errors while list is mounting
    }

    const targetList = masonryRefs.current[tags[index].key as TagKey];
    targetList?.scrollToOffset({ offset: 0, animated: false });
  }, [selectedTag?.key, tags?.length, tags]);

  // 처음 데이터 로딩 시에만 에러 화면 표시
  const shouldShowError = isError && !hasInitialData;

  useEffect(() => {
    setGalleryError(shouldShowError);
  }, [shouldShowError, setGalleryError]);

  useEffect(() => {
    const targetKey = selectedTag?.key as TagKey | undefined;
    if (!targetKey || !ageGroups?.[targetKey]) {
      return;
    }

    ageGroups[targetKey].gallery.forEach(item => {
      if (item.type === 'VIDEO') {
        return;
      }
      if (aspectRatioRef.current[item.id]) {
        return;
      }
      Image.getSize(
        item.url,
        (width, height) => {
          if (!width || !height) {
            return;
          }
          aspectRatioRef.current[item.id] = width / height;
          setAspectRatiosVersion(prev => prev + 1);
        },
        () => {},
      );
    });
  }, [ageGroups, selectedTag?.key]);

  const handleTagPress = useCallback(
    (index: number) => {
      isTagClickScrolling.current = true;
      handleTagPressBase(index);
      horizontalListRef.current?.scrollToIndex({ index, animated: true });
      const list = masonryRefs.current[tags[index].key as TagKey];
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
    (tagKey: TagKey) =>
      ({ item }: ListRenderItemInfo<GalleryType>) => {
        const isAiTag = tagKey === 'AI_PHOTO';
        const aspectRatio =
          aspectRatioRef.current[item.id] &&
          isFinite(aspectRatioRef.current[item.id])
            ? aspectRatioRef.current[item.id]
            : 1;

        return (
          <TouchableOpacity
            onPress={() => handleGalleryItemPress(item, isAiTag)}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 12,
              marginHorizontal: 6,
            }}
          >
            {isAiTag ? (
              <Video
                source={{ uri: item.url }}
                style={{
                  width: '100%',
                  aspectRatio,
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
                  aspectRatio,
                }}
                borderRadius={12}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        );
      },
    [handleGalleryItemPress],
  );

  const renderMasonryList = useCallback(
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
              masonryRefs.current[tagKey as TagKey] = ref;
            }}
            data={galleryItems}
            numColumns={2}
            masonry
            renderItem={renderGalleryItem(tagKey)}
            estimatedItemSize={220}
            extraData={aspectRatiosVersion}
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
      tags,
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
          renderItem={renderMasonryList}
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
