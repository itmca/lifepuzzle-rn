import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import CtaButton from '../../components/button/CtaButton';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroType} from '../../types/hero.type';
import {
  getCurrentHeroPhotoUri,
  heroState,
  wrtingHeroState,
} from '../../recoils/hero.recoil';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useUpdatePublisher} from '../../service/hooks/update.hooks';
import {currentHeroUpdate, heroUpdate} from '../../recoils/update.recoil';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {
  HeroSettingNavigationProps,
  HeroSettingRouteProps,
} from '../../navigation/types';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

const HeroModificationPage = (): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();

  const [name, setName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState<string>('');

  const resetWritingHero = useResetRecoilState(wrtingHeroState);
  const [modifyingHero, setModifyingHero] = useRecoilState(wrtingHeroState);
  const currentHeroPhotoUri = useRecoilValue(getCurrentHeroPhotoUri);
  const currentHero = useRecoilValue(heroState);

  const publishHeroUpdate = useUpdatePublisher(heroUpdate);
  const publishCurrentHeroUpdate = useUpdatePublisher(currentHeroUpdate);

  const heroNo = route.params.heroNo;

  const [loading] = useAuthAxios<HeroType>({
    requestOption: {
      url: `/heroes/${heroNo}`,
      method: 'get',
    },
    onResponseSuccess: hero => {
      setModifyingHero(hero);
      setName(hero.heroName);
      setNickName(hero.heroNickName);
      setBirthday(hero.birthday ? new Date(hero.birthday) : new Date());
      setTitle(hero.title || '');
    },
    disableInitialRequest: false,
  });

  const url = `/heroes/profile/${String(heroNo)}`;

  const [updateLoading, refetch] = useAuthAxios<void>({
    requestOption: {
      method: 'post',
      url: url,
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      CustomAlert.simpleAlert('주인공이 수정되었습니다.');
      publishHeroUpdate();
      if (currentHero.heroNo === heroNo) {
        publishCurrentHeroUpdate();
      }
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
    const photo: PhotoIdentifier | undefined = modifyingHero?.modifiedImage;

    const currentTime = Date.now();
    const uri = photo?.node.image.uri;
    const fileParts = uri?.split('/');
    const imgName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
    const imgPath = photo
      ? `${currentTime}_${String(imgName)}`
      : modifyingHero?.imageURL;
    const savedHero: HeroType = {
      ...modifyingHero,
      heroNo: heroNo,
      heroName: name,
      heroNickName: nickName,
      birthday: birthday,
      title: title,
      imageURL: imgPath,
    };

    formData.append('toUpdate', {
      string: JSON.stringify(savedHero),
      type: 'application/json',
    });
  };

  const addHeroPhotoInFormData = (formData: FormData) => {
    const photo: PhotoIdentifier | undefined = modifyingHero?.modifiedImage;

    if (!photo) return;

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
    if (!name || !nickName || !birthday || !title) {
      CustomAlert.simpleAlert('누락된 값이 있습니다.');
      return;
    }

    const formData = new FormData();

    addHeroInFormData(formData);
    addHeroPhotoInFormData(formData);

    refetch({data: formData});
  };

  const goBack = () => {
    resetWritingHero();
    navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <LoadingContainer isLoading={loading || updateLoading}>
        <KeyboardAwareScrollView
          style={styles.scrollViewContainer}
          contentContainerStyle={styles.formContainer}
          extraHeight={0}
          keyboardShouldPersistTaps={'always'}>
          <TouchableOpacity
            style={{marginTop: 32, marginBottom: 32}}
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
            text={title}
            onChangeText={setTitle}
            placeholder="행복했던 나날들"
          />
          <CtaButton text="저장" onPress={onSubmit} />
        </KeyboardAwareScrollView>
      </LoadingContainer>
    </View>
  );
};
export default HeroModificationPage;
