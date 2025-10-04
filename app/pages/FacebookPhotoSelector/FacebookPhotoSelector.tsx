import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import DropDownPicker from 'react-native-dropdown-picker';
import SelectableFacebookPhoto from '../../components/photo/SelectableFacebookPhoto';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {
  selectedGalleryItemsState,
  isGalleryUploadingState,
} from '../../recoils/gallery-write.recoil';
import {useFacebookPhotos} from '../../service/hooks/facebook.photos.hook';
import {FacebookPhotoItem} from '../../types/facebook.type';
import {AgeType} from '../../types/photo.type';
import {Color} from '../../constants/color.constant';
import {BodyTextB} from '../../components/styled/components/Text';
import Icon from 'react-native-vector-icons/FontAwesome';
import {toPhotoIdentifierFromFacebookPhoto} from '../../service/photo-identifier.service';
import {BasicNavigationProps} from '../../navigation/types';

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

const FacebookPhotoSelector = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [facebookPhotos, setFacebookPhotos] = useState<FacebookPhotoItem[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<FacebookPhotoItem[]>([]);
  const [selectedGalleryItems, setSelectedGalleryItems] = useRecoilState(
    selectedGalleryItemsState,
  );
  const isGalleryUploading = useRecoilValue(isGalleryUploadingState);

  // Age group dropdown state
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeType | null>(
    null,
  );
  const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);

  const {isLoading, getFacebookPhotos} = useFacebookPhotos({
    onSuccess: response => {
      const photoItems = response.photos.map((photo, index) => ({
        id: `facebook_${index}`,
        imageUrl: photo.imageUrl,
        selected: false,
      }));
      setFacebookPhotos(photoItems);
    },
    onError: error => {
      Alert.alert('오류', '페이스북 사진을 불러오는데 실패했습니다.');
      navigation.goBack();
    },
  });

  useEffect(() => {
    handleFacebookLogin();
  }, []);

  const handleFacebookLogin = async () => {
    try {
      // Facebook 로그인 실행
      const result = await LoginManager.logInWithPermissions(['user_photos']);

      if (result.isCancelled) {
        Alert.alert('로그인 취소', '페이스북 로그인이 취소되었습니다.');
        navigation.goBack();
        return;
      }

      // AccessToken 가져오기
      const accessToken = await AccessToken.getCurrentAccessToken();

      if (!accessToken) {
        Alert.alert('오류', '페이스북 인증에 실패했습니다.');
        navigation.goBack();
        return;
      }

      // 백엔드에 code 전달하여 사진 목록 가져오기
      getFacebookPhotos(accessToken.accessToken);
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('오류', '페이스북 로그인에 실패했습니다.');
      navigation.goBack();
    }
  };

  const handlePhotoSelect = (photo: FacebookPhotoItem) => {
    const updatedPhotos = facebookPhotos.map(p =>
      p.id === photo.id ? {...p, selected: true} : p,
    );
    setFacebookPhotos(updatedPhotos);
    setSelectedPhotos([...selectedPhotos, photo]);
  };

  const handlePhotoDeselect = (photo: FacebookPhotoItem) => {
    const updatedPhotos = facebookPhotos.map(p =>
      p.id === photo.id ? {...p, selected: false} : p,
    );
    setFacebookPhotos(updatedPhotos);
    setSelectedPhotos(selectedPhotos.filter(p => p.id !== photo.id));
  };

  const handleConfirmSelection = () => {
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
  };

  return (
    <LoadingContainer isLoading={isLoading || isGalleryUploading}>
      <ContentContainer flex={1} paddingHorizontal={16} paddingTop={16}>
        {/* Age Group Dropdown */}
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

        {/* Photo Grid */}
        <FlatList
          data={facebookPhotos}
          numColumns={3}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const order = selectedPhotos.findIndex(p => p.id === item.id) + 1;

            return (
              <SelectableFacebookPhoto
                onSelected={handlePhotoSelect}
                onDeselected={handlePhotoDeselect}
                size={DeviceWidth / 3}
                photo={item}
                selected={item.selected}
                order={order || undefined}
              />
            );
          }}
        />

        {/* Confirm Button */}
        {selectedPhotos.length > 0 && (
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
      </ContentContainer>
    </LoadingContainer>
  );
};

export default FacebookPhotoSelector;
