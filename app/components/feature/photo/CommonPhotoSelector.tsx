import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraRoll,
  cameraRollEventEmitter,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import Icon from '@react-native-vector-icons/fontawesome';
import ImagePicker from 'react-native-image-crop-picker';

import { logger } from '../../../utils/logger.util';
import { SelectablePhoto } from './SelectablePhoto';
import { LoadingContainer } from '../../ui/feedback/LoadingContainer';

import {
  hasAndroidPermission,
  usePhotoPermission,
} from '../../../services/device/permission.hook';

import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
  PhotoSelectorState,
} from '../../../types/ui/photo-selector.type';
import { FacebookPhotoItem } from '../../../types/external/facebook.type';
import { Color } from '../../../constants/color.constant';

const DeviceWidth = Dimensions.get('window').width;

interface CommonPhotoSelectorProps {
  config: PhotoSelectorConfig;
  callbacks: PhotoSelectorCallbacks;
  state?: PhotoSelectorState;
}

const CommonPhotoSelector: React.FC<CommonPhotoSelectorProps> = ({
  config,
  callbacks,
  state,
}) => {
  // React hooks
  const [devicePhotos, setDevicePhotos] = useState<PhotoIdentifier[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();
  const [internalSelectedPhotos, setInternalSelectedPhotos] = useState<
    (PhotoIdentifier | FacebookPhotoItem)[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  usePhotoPermission({
    onDeny: () => {
      if (callbacks.onPermissionDenied) {
        callbacks.onPermissionDenied();
      } else {
        Alert.alert('앨범 권한이 없습니다.', '', [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    },
  });

  // Side effects
  useEffect(() => {
    if (config.source === 'device') {
      void initDevicePhotos();
    }
  }, []);

  // Camera roll event listener for iOS 14+ (only for device source)
  useEffect(() => {
    let subscription: any;
    if (isAboveIOS14 && config.source === 'device') {
      subscription = cameraRollEventEmitter.addListener(
        'onLibrarySelectionChange',
        () => {
          void initDevicePhotos();
        },
      );
    }

    return () => {
      if (isAboveIOS14 && subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Custom functions
  const selectedPhotos = state?.selectedPhotos ?? internalSelectedPhotos;
  const setSelectedPhotos =
    state?.setSelectedPhotos ?? setInternalSelectedPhotos;

  const isAboveIOS14 =
    Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 14;

  const initDevicePhotos = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    const photoCount = config.initialPhotos || 20;
    const result = await CameraRoll.getPhotos({
      first:
        devicePhotos.length < photoCount ? photoCount : devicePhotos.length,
      assetType: config.assetType || 'Photos',
      include: ['filename', 'fileSize', 'location', 'imageSize'],
    });

    setDevicePhotos(result.edges);
    setNextCursor(result.page_info.end_cursor);
    setHasNextPage(result.page_info.has_next_page);
  };

  const handleLoadMore = async () => {
    if (config.source === 'device') {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }
      if (!nextCursor || !hasNextPage) {
        return;
      }

      const loadCount = config.loadMoreCount || 20;
      const result = await CameraRoll.getPhotos({
        first: loadCount,
        after: nextCursor,
        assetType: config.assetType || 'Photos',
      });

      setDevicePhotos(prev => [...prev, ...result.edges]);
      setNextCursor(result.page_info.end_cursor);
      setHasNextPage(result.page_info.has_next_page);
    } else if (config.source === 'custom' && config.onLoadMore) {
      config.onLoadMore();
    }
  };

  const handlePhotoSelect = (photo: PhotoIdentifier | FacebookPhotoItem) => {
    if (config.mode === 'single') {
      setSelectedPhotos([photo]);
      callbacks.onPhotoSelect?.(photo);
    } else {
      const maxSelection = config.maxSelection || Infinity;
      if (selectedPhotos.length < maxSelection) {
        const newSelection = [...selectedPhotos, photo];
        setSelectedPhotos(newSelection);
        callbacks.onPhotoSelect?.(photo);
        callbacks.onMultipleSelect?.(newSelection);
      }
    }
  };

  const handlePhotoDeselect = (photo: PhotoIdentifier | FacebookPhotoItem) => {
    const newSelection = selectedPhotos.filter(p => {
      if ('node' in photo && 'node' in p) {
        return (
          (p as PhotoIdentifier).node.image.uri !==
          (photo as PhotoIdentifier).node.image.uri
        );
      } else if ('id' in photo && 'id' in p) {
        return (p as FacebookPhotoItem).id !== (photo as FacebookPhotoItem).id;
      }
      return true;
    });

    setSelectedPhotos(newSelection);
    callbacks.onPhotoDeselect?.(photo);
    callbacks.onMultipleSelect?.(newSelection);
  };

  const handleConfirmSelection = () => {
    if (selectedPhotos.length === 0) {
      Alert.alert('알림', '선택된 사진이 없습니다.');
      return;
    }

    callbacks.onConfirm?.(selectedPhotos);
  };

  const handleCropPhotos = async () => {
    try {
      const croppedImages = [];
      for (const photo of selectedPhotos) {
        if ('node' in photo) {
          const photoIdentifier = photo as PhotoIdentifier;
          const croppedImage = await ImagePicker.openCropper({
            mediaType: 'photo',
            path: photoIdentifier.node.image.uri,
            cropping: true,
            freeStyleCropEnabled: true,
            cropperToolbarTitle: '사진 자르기',
          });
          croppedImages.push(croppedImage);
        }
      }
    } catch (error) {
      logger.debug('Image crop error:', error);
    }
  };

  const renderPhoto = ({
    item,
    index,
  }: {
    item: PhotoIdentifier | FacebookPhotoItem;
    index: number;
  }) => {
    const isSelected = selectedPhotos.some(p => {
      if ('node' in item && 'node' in p) {
        return (
          (p as PhotoIdentifier).node.image.uri ===
          (item as PhotoIdentifier).node.image.uri
        );
      } else if ('id' in item && 'id' in p) {
        return (p as FacebookPhotoItem).id === (item as FacebookPhotoItem).id;
      }
      return false;
    });

    const order = config.showOrderNumbers
      ? selectedPhotos.findIndex(p => {
          if ('node' in item && 'node' in p) {
            return (
              (p as PhotoIdentifier).node.image.uri ===
              (item as PhotoIdentifier).node.image.uri
            );
          } else if ('id' in item && 'id' in p) {
            return (
              (p as FacebookPhotoItem).id === (item as FacebookPhotoItem).id
            );
          }
          return false;
        }) + 1
      : undefined;

    return (
      <SelectablePhoto
        key={`${index}-${String(isSelected)}`}
        onSelected={handlePhotoSelect}
        onDeselected={handlePhotoDeselect}
        size={DeviceWidth / 3}
        photo={item}
        selected={isSelected}
        order={order}
      />
    );
  };

  const getPhotosData = (): (PhotoIdentifier | FacebookPhotoItem)[] => {
    if (config.source === 'device') {
      return devicePhotos;
    } else if (config.source === 'custom') {
      return config.customPhotos || [];
    }
    return [];
  };

  const photosData = getPhotosData();

  return (
    <LoadingContainer isLoading={isLoading}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={photosData}
          numColumns={3}
          keyExtractor={item => {
            if ('node' in item) {
              return (item as PhotoIdentifier).node.image.uri;
            } else {
              return (item as FacebookPhotoItem).id;
            }
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          renderItem={renderPhoto}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
          getItemLayout={(_, index) => ({
            length: DeviceWidth / 3,
            offset: (DeviceWidth / 3) * Math.floor(index / 3),
            index,
          })}
          // 첫 화면에 6-7행이 보이므로 7행(21개)을 초기 렌더링하여 빈 공간 방지
          initialNumToRender={21}
          // 스크롤 시 4행(12개)씩 렌더링하여 60fps 유지와 반응성 균형
          maxToRenderPerBatch={12}
          // 기본값(21)의 절반 정도로 메모리 절약하되 빠른 스크롤에도 빈 공간 없도록 설정
          windowSize={11}
          removeClippedSubviews={true}
        />

        {/* Confirm Button */}
        {config.showConfirmButton && selectedPhotos.length > 0 && (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: Color.MAIN_DARK,
              borderRadius: 50,
              width: 50,
              height: 50,
              position: 'absolute',
              bottom: 25,
              right: 25,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.WHITE,
            }}
            onPress={handleConfirmSelection}
          >
            <Icon name="check" size={25} color={Color.MAIN_DARK} />
          </TouchableOpacity>
        )}

        {/* Crop Button */}
        {config.showCropButton && selectedPhotos.length > 0 && (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: Color.MAIN_DARK,
              borderRadius: 50,
              width: 50,
              height: 50,
              position: 'absolute',
              bottom: 25,
              right: config.showConfirmButton ? 85 : 25,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.WHITE,
            }}
            onPress={handleCropPhotos}
          >
            <Icon name="magic" size={25} color={Color.MAIN_DARK} />
          </TouchableOpacity>
        )}
      </View>
    </LoadingContainer>
  );
};

export { CommonPhotoSelector };
