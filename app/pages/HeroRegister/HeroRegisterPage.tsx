import React, {useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import CtaButton from '../../components/button/CtaButton';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {
  getCurrentHeroPhotoUri,
  wrtingHeroState,
} from '../../recoils/hero.recoil';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';

import {HeroType} from '../../types/hero.type';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useUpdatePublisher} from '../../service/hooks/update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {BasicNavigationProps} from '../../navigation/types';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

const HeroRegisterPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishHeroUpdate = useUpdatePublisher(heroUpdate);
  const [newHero, setNewHero] = useState<HeroType>({
    heroNo: -1,
    heroName: '',
    heroNickName: '',
    birthday: undefined,
    title: '',
  });

  const [name, setName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const resetWritingHero = useResetRecoilState(wrtingHeroState);
  const [writingHero, setWritingHero] = useRecoilState(wrtingHeroState);
  const currentHeroPhotoUri = useRecoilValue(getCurrentHeroPhotoUri);
  const [loading, registerHero] = useAuthAxios({
    requestOption: {
      url: '/heroes',
      method: 'post',
    },
    onResponseSuccess: () => {
      Alert.alert('주인공이 생성되었습니다.');
      goBack();
    },
    onError: () => {
      CustomAlert.retryAlert(
        '주인공 프로필 수정이 실패했습니다.',
        onSubmit,
        goBack,
      );
    },
    disableInitialRequest: true,
  });

  const addHeroInFormData = (formData: FormData) => {
    const photo: PhotoIdentifier | undefined = writingHero?.modifiedImage;
    console.log(photo?.node.image);
    const currentTime = Date.now();
    const uri = photo?.node.image.uri;
    const fileParts = uri?.split('/');
    const imgName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
    const imgPath = photo
      ? `${currentTime}_${String(imgName)}`
      : writingHero?.imageURL;
    const savedHero: HeroType = {
      ...writingHero,
      heroName: name,
      heroNickName: nickName,
      birthday: birthday,
      title: title,
      imageURL: imgPath,
    };

    formData.append('toWrite', {
      string: JSON.stringify(savedHero),
      type: 'application/json',
    });
  };

  const addHeroPhotoInFormData = (formData: FormData) => {
    const photo: PhotoIdentifier | undefined = writingHero?.modifiedImage;

    if (!photo) {
      return;
    }

    const uri = photo.node.image.uri;
    const fileParts = uri?.split('/');
    const fileName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
    const type = IMG_TYPE;
    formData.append('photo', {
      uri: uri,
      type: type,
      name: fileName,
    });
  };

  const onSubmit = () => {
    if (!name || !nickName || !title) {
      Alert.alert('누락된 값이 있습니다.');
      return;
    }

    const formData = new FormData();

    addHeroInFormData(formData);
    addHeroPhotoInFormData(formData);

    registerHero({data: formData});
  };

  const goBack = () => {
    resetWritingHero();
    navigation.goBack();
    publishHeroUpdate();
  };

  return (
    <ScreenContainer>
      <LoadingContainer isLoading={loading}>
        <ScrollContainer
          contentContainerStyle={styles.formContainer}
          extraHeight={0}
          keyboardShouldPersistTaps={'always'}>
          <ContentContainer>
            <TouchableOpacity
              onPress={() => {
                navigation.push('NoTab', {
                  screen: 'HeroSettingNavigator',
                  params: {
                    screen: 'HeroSelectingPhoto',
                  },
                });
              }}>
              <HeroAvatar size={128} imageURL={currentHeroPhotoUri} />
            </TouchableOpacity>
            <BasicTextInput
              label="이름"
              text={name}
              onChangeText={setName}
              placeholder="홍길동"
            />
            <BasicTextInput
              label="닉네임"
              text={nickName}
              onChangeText={setNickName}
              placeholder="소중한 당신"
            />
            <CustomDateInput
              label="태어난 날"
              date={birthday}
              onChange={setBirthday}
            />
            <BasicTextInput
              label="제목"
              placeholder={'행복했던 나날들'}
              text={title}
              onChangeText={setTitle}
            />
            <CtaButton text="주인공 추가" onPress={onSubmit} />
          </ContentContainer>
        </ScrollContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default HeroRegisterPage;
