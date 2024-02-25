import {
  CameraRoll,
  cameraRollEventEmitter,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useState} from 'react';

import {
  Dimensions,
  EmitterSubscription,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {useRecoilState} from 'recoil';

import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {selectedHeroPhotoState} from '../../recoils/hero.recoil';

const DeviceWidth = Dimensions.get('window').width;

const HeroSelectingPhotoPage = (): JSX.Element => {
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();
  const [photos, setPhotos] = useState<Array<PhotoIdentifier>>();
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const [selectedPhoto, setSelectedPhoto] = useRecoilState(
    selectedHeroPhotoState,
  );
  const isAboveIOS14 =
    Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 14;

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
      assetType: 'Photos',
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
      assetType: 'Photos',
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

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  // async function initIOSPermission() {
  //   const a = await Permissions.checkMultiple([
  //     PERMISSIONS.IOS.PHOTO_LIBRARY,
  //     PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
  //   ]);
  //   console.log('prev', a);
  //   //await Permissions.request(PERMISSIONS.IOS.CAMERA);
  //   await Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  //   await Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
  //   const c = await Permissions.checkMultiple([
  //     PERMISSIONS.IOS.PHOTO_LIBRARY,
  //     PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
  //   ]);
  //   console.log('next', c);
  //   //Permissions.PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
  //   //await Permissions.openLimitedPhotoLibraryPicker();
  // }

  return (
    <>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1}
        renderItem={({item, index}) => {
          const isDisabled =
            selectedPhoto?.node.image.uri === item.node.image.uri;
          return (
            <SelectablePhoto
              key={`${index}-${String(isDisabled)}`}
              onSelected={(item: PhotoIdentifier) => {
                setSelectedPhoto(item);
              }}
              onDeselected={() => {
                setSelectedPhoto(undefined);
              }}
              size={DeviceWidth / 3}
              photo={item}
              selected={isDisabled}
            />
          );
        }}
      />
    </>
  );
};

export default HeroSelectingPhotoPage;
