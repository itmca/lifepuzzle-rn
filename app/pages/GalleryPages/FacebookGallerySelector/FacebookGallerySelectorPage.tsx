import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../navigation/types.tsx';

import InAppBrowser from 'react-native-inappbrowser-reborn';
import DropDownPicker from 'react-native-dropdown-picker';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { BodyTextB } from '../../../components/ui/base/TextBase';

import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { FacebookPhotoItem } from '../../../types/external/facebook.type';
import { AgeType } from '../../../types/core/media.type';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
  PhotoSelectorState,
} from '../../../types/ui/photo-selector.type';
import { toPhotoIdentifierFromFacebookPhoto } from '../../../utils/photo-identifier.util.ts';
import { useFacebookPhotos } from '../../../services/gallery/facebook.photos.hook';
import { Color } from '../../../constants/color.constant';
import { useSelectionStore } from '../../../stores/selection.store.ts';
import { useUIStore } from '../../../stores';

const ageGroupOptions = [
  { label: '10세 미만', value: 'UNDER_TEENAGER' as AgeType },
  { label: '10대', value: 'TEENAGER' as AgeType },
  { label: '20대', value: 'TWENTIES' as AgeType },
  { label: '30대', value: 'THIRTY' as AgeType },
  { label: '40대', value: 'FORTY' as AgeType },
  { label: '50대', value: 'FIFTY' as AgeType },
  { label: '60대', value: 'SIXTY' as AgeType },
  { label: '70대', value: 'SEVENTY' as AgeType },
  { label: '80대', value: 'EIGHTY' as AgeType },
  { label: '90대', value: 'NINETY' as AgeType },
  { label: '100세 이상', value: 'UPPER_NINETY' as AgeType },
];

const FacebookGallerySelector = (): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [selection, setSelection] = useSelectionStore(
    state => state.selectedGalleryItems,
  );

  const selectedGalleryItems = selection.gallery;
  const isGalleryUploading = useUIStore(state => state.isGalleryUploading);
  const setSelectedGalleryItems = (items: any[]) =>
    setSelection((prev: any) => ({ ...prev, gallery: items }));

  // Facebook specific state
  const [facebookPhotos, setFacebookPhotos] = useState<FacebookPhotoItem[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<FacebookPhotoItem[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeType | null>(
    null,
  );
  const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoading: facebookLoading, getFacebookPhotos } = useFacebookPhotos({
    onSuccess: response => {
      const photoItems = response.photos.map((photo, index) => ({
        id: `facebook_${index}`,
        imageUrl: photo.imageUrl,
        selected: false,
      }));
      setFacebookPhotos(photoItems);
      setIsLoading(false);
    },
    onError: () => {
      Alert.alert('오류', '페이스북 사진을 불러오는데 실패했습니다.');
      navigation.goBack();
      setIsLoading(false);
    },
  });

  useEffect(() => {
    void handleFacebookLogin();
  }, []);

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
      const API_URL = process.env.API_URL;
      const redirectUri = `${API_URL}/v1/facebook/callback`;

      const facebookAuthUrl =
        'https://www.facebook.com/v18.0/dialog/oauth?' +
        `client_id=${FACEBOOK_APP_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        'scope=user_photos&' +
        'response_type=code&' +
        'state=facebook_auth';

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
        const urlParts = result.url.split('?')[1];
        const params = new Map<string, string>();

        if (urlParts) {
          urlParts.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
              params.set(key, decodeURIComponent(value));
            }
          });
        }

        const code = params.get('code');
        const state = params.get('state');

        if (!code || state !== 'facebook_auth') {
          throw new Error('Facebook authentication failed');
        }

        getFacebookPhotos(code);
      } else {
        navigation.goBack();
        setIsLoading(false);
      }
    } catch (_err) {
      Alert.alert('오류', '페이스북 로그인에 실패했습니다.');
      navigation.goBack();
      setIsLoading(false);
    }
  };

  const config: PhotoSelectorConfig = {
    mode: 'multiple',
    source: 'custom',
    customPhotos: facebookPhotos,
    showOrderNumbers: true,
    showConfirmButton: true,
  };

  const callbacks: PhotoSelectorCallbacks = {
    onMultipleSelect: (photos: (PhotoIdentifier | FacebookPhotoItem)[]) => {
      setSelectedPhotos(photos as FacebookPhotoItem[]);
    },
    onConfirm: () => {
      if (selectedPhotos.length === 0) {
        Alert.alert('알림', '선택된 사진이 없습니다.');
        return;
      }

      if (!selectedAgeGroup) {
        Alert.alert('알림', '나이대를 선택해주세요.');
        return;
      }

      // Facebook 사진을 PhotoIdentifier 형태로 변환
      const photoIdentifiers = selectedPhotos.map(photo =>
        toPhotoIdentifierFromFacebookPhoto(photo, selectedAgeGroup),
      );

      // 선택된 사진들을 갤러리 아이템에 추가
      setSelectedGalleryItems([...selectedGalleryItems, ...photoIdentifiers]);

      navigation.goBack();
    },
  };

  const state: PhotoSelectorState = {
    selectedPhotos: selectedPhotos as (PhotoIdentifier | FacebookPhotoItem)[],
    setSelectedPhotos: (photos: (PhotoIdentifier | FacebookPhotoItem)[]) => {
      setSelectedPhotos(
        photos.filter(photo => !('node' in photo)) as FacebookPhotoItem[],
      );
    },
  };

  return (
    <PageContainer
      isLoading={isLoading || facebookLoading || isGalleryUploading}
    >
      <ContentContainer flex={1} paddingTop={16}>
        {/* Age Group Dropdown */}
        <ContentContainer paddingBottom={16} paddingHorizontal={16}>
          <ContentContainer paddingBottom={8}>
            <BodyTextB color={Color.BLACK}>나이대 선택</BodyTextB>
          </ContentContainer>
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

        {/* Photo Grid */}
        <CommonPhotoSelector
          config={config}
          callbacks={callbacks}
          state={state}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default FacebookGallerySelector;
