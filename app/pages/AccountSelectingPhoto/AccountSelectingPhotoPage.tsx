import {
  CameraRoll,
  cameraRollEventEmitter,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useState} from 'react';

import {
  Dimensions,
  EmitterSubscription,
  PermissionsAndroid,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {useRecoilState} from 'recoil';

import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {selectedUserPhotoState} from '../../recoils/user.recoil';

const DeviceWidth = Dimensions.get('window').width;

const AccountSelectingPhotoPage = (): JSX.Element => {
  const [photos, setPhotos] = useState<Array<PhotoIdentifier>>();
  const [selectedPhoto, setSelectedPhoto] = useRecoilState(
    selectedUserPhotoState,
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

    const result = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    });
    setPhotos(result.edges);
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

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ScrollView
          style={{height: 500}}
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {photos?.map((photo, index) => {
            const isDisabled =
              selectedPhoto?.node.image.uri === photo.node.image.uri;

            return (
              <SelectablePhoto
                key={`${index}-${String(isDisabled)}`}
                onSelected={(photo: PhotoIdentifier) => {
                  setSelectedPhoto(photo);
                }}
                onDeselected={() => {
                  setSelectedPhoto(undefined);
                }}
                size={DeviceWidth / 3}
                photo={photo}
                selected={isDisabled}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default AccountSelectingPhotoPage;
