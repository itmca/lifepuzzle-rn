import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import CtaButton from '../../components/button/CtaButton';
import {AccountItem} from '../../components/hero/AccountItem';
import {RoleItem} from '../../components/hero/RoleItem';
import {RoleItemList} from '../../components/hero/RoleItemList';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ImageButton} from '../../components/styled/components/Button';
import {MediumImage} from '../../components/styled/components/Image';
import {MediumText, SmallText} from '../../components/styled/components/Text';
import {
  MediumTitle,
  XSmallTitle,
} from '../../components/styled/components/Title';
import {
  ContentContainer,
  HorizontalContentContainer,
  OutLineContentContainer,
} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {DUMMY_LINKED_USER} from '../../constants/dummy.constant';
import {RoleList} from '../../constants/role.constant';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {
  HeroSettingNavigationProps,
  HeroSettingRouteProps,
} from '../../navigation/types';
import {
  getCurrentHeroPhotoUri,
  heroState,
  wrtingHeroState,
} from '../../recoils/hero.recoil';
import {currentHeroUpdate, heroUpdate} from '../../recoils/update.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {useUpdatePublisher} from '../../service/hooks/update.hooks';
import {HeroType, LinkedUserType} from '../../types/hero.type';
import {styles} from './styles';

const HeroModificationPage = (): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '65%'], []);
  // callbacks
  const handlePresentModalPress = useCallback((linkedUser: LinkedUserType) => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
    setSelectedLinkedUser(linkedUser);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    [],
  );
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const [linkedUser, setLinkedUser] = useState<LinkedUserType[]>([]);
  const [selectedLinkedUser, setSelectedLinkedUser] =
    useState<LinkedUserType>(undefined);

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
  const updateRole = (role: string) => {
    setSelectedLinkedUser({...selectedLinkedUser, role: role});
    setLinkedUser(
      linkedUser.map(item =>
        item.userId === selectedLinkedUser.userId
          ? {...item, role: role}
          : item,
      ),
    );
  };
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

      //연결계정 임시 데이터
      setLinkedUser(DUMMY_LINKED_USER);
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
    <BottomSheetModalProvider>
      <ScrollContainer
        contentContainerStyle={styles.formContainer}
        extraHeight={0}
        keyboardShouldPersistTaps={'always'}>
        <ScreenContainer>
          <LoadingContainer isLoading={loading || updateLoading}>
            <ContentContainer>
              <ImageButton
                onPress={() => {
                  navigation.push('NoTab', {
                    screen: 'HeroSettingNavigator',
                    params: {
                      screen: 'HeroSelectingPhoto',
                    },
                  });
                }}>
                <HeroAvatar size={128} imageURL={currentHeroPhotoUri} />
              </ImageButton>
              <ContentContainer gap={'10px'}>
                <XSmallTitle fontWeight={'600'}>이름</XSmallTitle>
                <BasicTextInput
                  label=""
                  text={name}
                  onChangeText={setName}
                  placeholder="홍길동"
                />
                <XSmallTitle fontWeight={'600'}>닉네임</XSmallTitle>
                <BasicTextInput
                  label=""
                  text={nickName}
                  onChangeText={setNickName}
                  placeholder="소중한 당신"
                />
                <XSmallTitle fontWeight={'600'}>제목</XSmallTitle>
                <BasicTextInput
                  label=""
                  text={title}
                  onChangeText={setTitle}
                  placeholder="행복했던 나날들"
                />
                <XSmallTitle fontWeight={'600'}>태어난 날</XSmallTitle>
                <CustomDateInput
                  label=""
                  date={birthday}
                  onChange={setBirthday}
                />
                <XSmallTitle fontWeight={'600'}>연결 계정</XSmallTitle>
                {linkedUser.map((linkedUser: LinkedUserType, index) => (
                  <AccountItem
                    key={index}
                    linkedUser={linkedUser}
                    onSelect={handlePresentModalPress}></AccountItem>
                ))}
              </ContentContainer>
              <CtaButton marginTop="16px" text="저장" onPress={onSubmit} />
            </ContentContainer>
          </LoadingContainer>
        </ScreenContainer>
      </ScrollContainer>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}>
        <ScreenContainer>
          <RoleItemList target={selectedLinkedUser} onSelect={updateRole} />
          <CtaButton text="저장" onPress={handleClosePress} />
        </ScreenContainer>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
export default HeroModificationPage;
