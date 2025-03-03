import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, FlatList, Platform} from 'react-native';
import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {
  hasAndroidPermission,
  usePhotoPermission,
} from '../../service/hooks/permission.hook';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  isGalleryUploadingState,
  selectedGalleryItemsState,
} from '../../recoils/gallery-write.recoil.ts';
import {LoadingContainer} from '../../components/loadding/LoadingContainer.tsx';

const DeviceWidth = Dimensions.get('window').width;

const StoryGallerySelector = (): JSX.Element => {
  const navigation = useNavigation();
  const [, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();
  const [gallery, setGallery] = useState<PhotoIdentifier[]>([]);

  const [selectedGalleryItems, setSelectedGalleryItems] = useRecoilState(
    selectedGalleryItemsState,
  );

  const isGalleryUploading = useRecoilValue(isGalleryUploadingState);

  const isAboveIOS14 =
    Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 14;

  usePhotoPermission({
    onDeny: () => {
      Alert.alert('앨범 권한이 없습니다.', '', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    },
  });

  useEffect(() => {
    setSelectedGalleryItems([]);
    void initPhotos();
  }, []);

  const initPhotos = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      //TODO: Android 권한 없는 경우 Alert 필요
      return;
    }

    const {edges, page_info} = await CameraRoll.getPhotos({
      first: !gallery || gallery.length < 20 ? 20 : gallery.length,
      assetType: 'All',
    });

    setGallery(edges);

    setNextCursor(page_info.end_cursor);
    setHasNextPage(page_info.has_next_page);
  };
  const handleLoadMore = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      //TODO: Android 권한 없는 경우 Alert 필요
      return;
    }
    if (!nextCursor) {
      return;
    }
    const {edges, page_info} = await CameraRoll.getPhotos({
      first: 50,
      after: nextCursor,
      assetType: 'All',
    });
    setGallery(prev => [...(prev ?? []), ...edges]);

    setNextCursor(page_info.end_cursor);
    setHasNextPage(page_info.has_next_page);
  };

  return (
    <LoadingContainer isLoading={isGalleryUploading}>
      <FlatList
        data={gallery}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        getItemLayout={(data, index) => ({
          length: DeviceWidth / 3,
          offset: (DeviceWidth / 3) * index,
          index,
        })}
        renderItem={({item, index}) => {
          const isDisabled =
            selectedGalleryItems?.filter(
              e => e.node.image.uri === item.node.image.uri,
            ).length > 0;
          const order =
            selectedGalleryItems?.findIndex(
              e => e.node.image.uri === item.node.image.uri,
            ) + 1;

          return (
            <SelectablePhoto
              onSelected={(photo: PhotoIdentifier) => {
                setSelectedGalleryItems([...selectedGalleryItems, photo]);
              }}
              //! size 수정 필요
              onDeselected={(photo: PhotoIdentifier) => {
                setSelectedGalleryItems(
                  selectedGalleryItems.filter(
                    e => e.node.image.uri !== photo.node.image.uri,
                  ),
                );
              }}
              size={DeviceWidth / 3}
              photo={item}
              selected={isDisabled}
              order={order}
            />
          );
        }}
      />
    </LoadingContainer>
  );
};

export default StoryGallerySelector;
