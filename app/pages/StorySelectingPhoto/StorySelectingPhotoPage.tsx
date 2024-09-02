import {
  CameraRoll,
  cameraRollEventEmitter,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  EmitterSubscription,
  FlatList,
  Platform,
} from 'react-native';
import {useRecoilState} from 'recoil';
import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {
  hasAndroidPermission,
  usePhotoPermission,
} from '../../service/hooks/permission.hook';
import {useNavigation} from '@react-navigation/native';
import SelectedPhotoList from '../../components/photo/SelectedPhotoList';
import {writingStoryState} from '../../recoils/story-write.recoil';

const DeviceWidth = Dimensions.get('window').width;

const StorySelectingPhotoPage = (): JSX.Element => {
  const navigation = useNavigation();
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);

  const selectedPhotoList = writingStory.photos ?? [];
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
    void initPhotos();
  }, []);
  const initPhotos = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      //TODO: Android 권한 없는 경우 Alert 필요
      return;
    }

    const {edges, page_info} = await CameraRoll.getPhotos({
      first: !photos || photos.length < 20 ? 20 : photos.length,
      assetType: 'All',
    });
    setPhotos(edges);

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
      first: 20,
      after: nextCursor,
      assetType: 'All',
    });
    setPhotos(prev => [...(prev ?? []), ...edges]);

    setNextCursor(page_info.end_cursor);
    setHasNextPage(page_info.has_next_page);
  };

  useEffect(() => {
    let subscription: EmitterSubscription;
    if (isAboveIOS14) {
      subscription = cameraRollEventEmitter.addListener(
        'onLibrarySelectionChange',
        () => {
          void initPhotos();
        },
      );
    }

    return () => {
      if (isAboveIOS14 && subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <>
      {selectedPhotoList.length != 0 && (
        <SelectedPhotoList
          target={'all'}
          upload={false}
          size={50}></SelectedPhotoList>
      )}
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1}
        renderItem={({item, index}) => {
          const isDisabled =
            selectedPhotoList?.filter(
              e => e.node.image.uri === item.node.image.uri,
            ).length > 0;
          const order =
            selectedPhotoList?.findIndex(
              e => e.node.image.uri === item.node.image.uri,
            ) + 1;

          return (
            <SelectablePhoto
              onSelected={(photo: PhotoIdentifier) => {
                setWritingStory({
                  photos: [...selectedPhotoList, photo],
                });
              }}
              //! size 수정 필요
              onDeselected={(photo: PhotoIdentifier) => {
                setWritingStory({
                  photos: selectedPhotoList.filter(
                    e => e.node.image.uri !== photo.node.image.uri,
                  ),
                });
              }}
              size={DeviceWidth / 3}
              photo={item}
              selected={isDisabled}
              order={order}
            />
          );
        }}
      />
    </>
  );
};

export default StorySelectingPhotoPage;
