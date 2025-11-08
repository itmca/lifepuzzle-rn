import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import {
  CameraRoll,
  PhotoIdentifier,
  cameraRollEventEmitter,
  EmitterSubscription,
} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';

import SelectablePhoto from './SelectablePhoto';
import SelectableFacebookPhoto from './SelectableFacebookPhoto';
import {LoadingContainer} from '../loadding/LoadingContainer';
import {ContentContainer} from '../styled/container/ContentContainer';
import {BodyTextB} from '../styled/components/Text';

import {
  hasAndroidPermission,
  usePhotoPermission,
} from '../../service/hooks/permission.hook';
import {useFacebookPhotos} from '../../service/hooks/facebook.photos.hook';
import {toPhotoIdentifierFromFacebookPhoto} from '../../service/photo-identifier.service';

import {
  PhotoSelectorConfig,
  PhotoSelectorCallbacks,
  PhotoSelectorState,
} from '../../types/photo-selector.type';
import {FacebookPhotoItem} from '../../types/facebook.type';
import {AgeType} from '../../types/photo.type';
import {Color} from '../../constants/color.constant';

const DeviceWidth = Dimensions.get('window').width;

const ageGroupOptions = [
  {label: '10세 미만', value: 'UNDER_TEENAGER' as AgeType},
  {label: '10대', value: 'TEENAGER' as AgeType},
  {label: '20대', value: 'TWENTIES' as AgeType},
  {label: '30대', value: 'THIRTY' as AgeType},
  {label: '40대', value: 'FORTY' as AgeType},
  {label: '50대', value: 'FIFTY' as AgeType},
  {label: '60대', value: 'SIXTY' as AgeType},
  {label: '70대', value: 'SEVENTY' as AgeType},
  {label: '80대', value: 'EIGHTY' as AgeType},
  {label: '90대', value: 'NINETY' as AgeType},
  {label: '100세 이상', value: 'UPPER_NINETY' as AgeType},
];

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
  const navigation = useNavigation();

  // Device photos state
  const [devicePhotos, setDevicePhotos] = useState<PhotoIdentifier[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();

  // Facebook photos state
  const [facebookPhotos, setFacebookPhotos] = useState<FacebookPhotoItem[]>([]);

  // Selection state
  const [internalSelectedPhotos, setInternalSelectedPhotos] = useState<
    (PhotoIdentifier | FacebookPhotoItem)[]
  >([]);
  const selectedPhotos = state?.selectedPhotos ?? internalSelectedPhotos;
  const setSelectedPhotos =
    state?.setSelectedPhotos ?? setInternalSelectedPhotos;

  // Age selector state (for Facebook)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeType | null>(
    null,
  );
  const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const isAboveIOS14 =
    Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 14;

  // Facebook photos hook
  const {isLoading: facebookLoading, getFacebookPhotos} = useFacebookPhotos({
    onSuccess: response => {
      const photoItems = response.photos.map((photo, index) => ({
        id: `facebook_${index}`,
        imageUrl: photo.imageUrl,
        selected: false,
      }));
      setFacebookPhotos(photoItems);
      setIsLoading(false);
    },
    onError: error => {
      callbacks.onError?.('페이스북 사진을 불러오는데 실패했습니다.');
      setIsLoading(false);
    },
  });

  // Photo permission hook
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

  useEffect(() => {
    if (config.source === 'device') {
      void initDevicePhotos();
    } else if (config.source === 'facebook') {
      void handleFacebookLogin();
    }
  }, []);

  // Camera roll event listener for iOS 14+
  useEffect(() => {
    let subscription: EmitterSubscription;
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
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
      const API_URL = process.env.API_URL;
      const redirectUri = `${API_URL}/v1/facebook/callback`;

      const facebookAuthUrl =
        `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${FACEBOOK_APP_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=user_photos&` +
        `response_type=code&` +
        `state=facebook_auth`;

      const result = await InAppBrowser.openAuth(facebookAuthUrl, redirectUri, {
        showTitle: false,
        toolbarColor: '#4267B2',
        secondaryToolbarColor: 'white',
        navigationBarColor: 'white',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        forceCloseOnRedirection: true,
      });

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        if (!code || state !== 'facebook_auth') {
          throw new Error('Facebook authentication failed');
        }

        getFacebookPhotos(code);
      } else {
        callbacks.onCancel?.();
        setIsLoading(false);
      }
    } catch (error) {
      callbacks.onError?.('페이스북 로그인에 실패했습니다.');
      setIsLoading(false);
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

    if (config.showAgeSelector && !selectedAgeGroup) {
      Alert.alert('알림', '나이대를 선택해주세요.');
      return;
    }

    callbacks.onConfirm?.(selectedPhotos, selectedAgeGroup || undefined);
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
      console.log('이미지 크롭 오류:', error);
    }
  };

  const renderDevicePhoto = ({
    item,
    index,
  }: {
    item: PhotoIdentifier;
    index: number;
  }) => {
    const isSelected = selectedPhotos.some(
      p =>
        'node' in p &&
        (p as PhotoIdentifier).node.image.uri === item.node.image.uri,
    );
    const order = config.showOrderNumbers
      ? selectedPhotos.findIndex(
          p =>
            'node' in p &&
            (p as PhotoIdentifier).node.image.uri === item.node.image.uri,
        ) + 1
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

  const renderFacebookPhoto = ({item}: {item: FacebookPhotoItem}) => {
    const isSelected = selectedPhotos.some(
      p => 'id' in p && (p as FacebookPhotoItem).id === item.id,
    );
    const order = config.showOrderNumbers
      ? selectedPhotos.findIndex(
          p => 'id' in p && (p as FacebookPhotoItem).id === item.id,
        ) + 1
      : undefined;

    return (
      <SelectableFacebookPhoto
        onSelected={handlePhotoSelect}
        onDeselected={handlePhotoDeselect}
        size={DeviceWidth / 3}
        photo={item}
        selected={isSelected}
        order={order}
      />
    );
  };

  const renderContent = () => {
    if (config.source === 'device') {
      if (config.mode === 'single') {
        return (
          <ScrollView
            style={{height: 500}}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {devicePhotos.map((photo, index) =>
              renderDevicePhoto({item: photo, index}),
            )}
          </ScrollView>
        );
      } else {
        return (
          <FlatList
            data={devicePhotos}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            renderItem={renderDevicePhoto}
          />
        );
      }
    } else if (config.source === 'facebook') {
      return (
        <FlatList
          data={facebookPhotos}
          numColumns={3}
          keyExtractor={item => item.id}
          renderItem={renderFacebookPhoto}
        />
      );
    }
  };

  return (
    <LoadingContainer isLoading={isLoading || facebookLoading}>
      <ContentContainer flex={1} paddingHorizontal={16} paddingTop={16}>
        {/* Age Group Dropdown for Facebook */}
        {config.source === 'facebook' && config.showAgeSelector && (
          <ContentContainer marginBottom={16} zIndex={1000}>
            <BodyTextB color={Color.BLACK} marginBottom={8}>
              나이대 선택
            </BodyTextB>
            <DropDownPicker
              open={ageDropdownOpen}
              value={selectedAgeGroup}
              items={ageGroupOptions}
              setOpen={setAgeDropdownOpen}
              setValue={setSelectedAgeGroup}
              placeholder="나이대를 선택하세요"
              style={{
                borderColor: Color.GREY_300,
                borderRadius: 8,
              }}
              dropDownContainerStyle={{
                borderColor: Color.GREY_300,
                borderRadius: 8,
              }}
              textStyle={{
                fontSize: 16,
                color: Color.BLACK,
              }}
              placeholderStyle={{
                color: Color.GREY_500,
              }}
            />
          </ContentContainer>
        )}

        {/* Photo Grid */}
        {config.mode === 'single' ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {renderContent()}
          </View>
        ) : (
          renderContent()
        )}

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
            onPress={handleConfirmSelection}>
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
            onPress={handleCropPhotos}>
            <Icon name="magic" size={25} color={Color.MAIN_DARK} />
          </TouchableOpacity>
        )}
      </ContentContainer>
    </LoadingContainer>
  );
};

export default CommonPhotoSelector;
