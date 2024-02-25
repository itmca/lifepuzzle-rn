import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import CtaButton from '../../components/button/CtaButton';
import {AccountItem} from '../../components/hero/AccountItem';
import {RoleItemList} from '../../components/hero/RoleItemList';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ImageButton} from '../../components/styled/components/Button';
import {XSmallTitle} from '../../components/styled/components/Title';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {DUMMY_LINKED_USER} from '../../constants/dummy.constant';
import {
  HeroSettingNavigationProps,
  HeroSettingRouteProps,
} from '../../navigation/types';
import {
  getCurrentHeroPhotoUri,
  writingHeroState,
} from '../../recoils/hero-write.recoil';
import {heroState, selectedHeroPhotoState} from '../../recoils/hero.recoil';
import {currentHeroUpdate, heroUpdate} from '../../recoils/update.recoil';
import {useIsHeroUploading} from '../../service/hooks/hero.write.hook';
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
  const snapPoints = useMemo(() => ['30%', '55%'], []);
  // callbacks
  const handlePresentModalPress = useCallback((linkedUser: LinkedUserType) => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
    setSelectedLinkedUser(linkedUser);
  }, []);

  const handleSheetChanges = useCallback(() => {}, []);
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
  const resetWritingHero = useResetRecoilState(writingHeroState);
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const [selectedHeroPhoto, setSelectedHeroPhoto] = useRecoilState(
    selectedHeroPhotoState,
  );
  const currentHeroPhotoUri = useRecoilValue(getCurrentHeroPhotoUri);

  const isHeroUploading = useIsHeroUploading();
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
      const toPhotoIdentifier = (uri: string) => ({
        node: {
          type: '',
          subTypes: undefined,
          group_name: '',
          image: {
            filename: uri.split('/').pop() || '',
            filepath: null,
            extension: null,
            uri: uri,
            height: 0,
            width: 0,
            fileSize: null,
            playableDuration: 0,
            orientation: null,
          },
          timestamp: 0,
          modificationTimestamp: 0,
          location: null,
        },
      });

      const currentPhoto = toPhotoIdentifier(hero.imageURL);

      setWritingHero({
        heroNo: -1,
        heroName: hero?.heroName ?? '',
        heroNickName: hero?.heroNickName,
        birthday: hero?.birthday,
        title: hero.title,
        imageURL: currentPhoto ? currentPhoto : undefined,
      });
      console.log('writingHero:' + writingHero);
      setName(hero.heroName);
      setNickName(hero.heroNickName);
      setBirthday(hero.birthday ? new Date(hero.birthday) : new Date());
      setTitle(hero.title || '');

      //연결계정 임시 데이터
      setLinkedUser(DUMMY_LINKED_USER);
    },
    disableInitialRequest: false,
  });

  useEffect(() => {
    setWritingHero({
      heroNo: -1,
      heroName: name,
      heroNickName: nickName,
      birthday: birthday,
      title: title,
    });
  }, [name, nickName, birthday, title]);

  return (
    <BottomSheetModalProvider>
      <ScrollContainer
        contentContainerStyle={styles.formContainer}
        extraHeight={0}
        keyboardShouldPersistTaps={'always'}>
        <ScreenContainer>
          <LoadingContainer isLoading={loading || isHeroUploading}>
            <ContentContainer gap={'20px'}>
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
              <ContentContainer marginTop={'20px'}>
                <CtaButton
                  active
                  text="연결 계정 추가"
                  onPress={() => {
                    navigation.push('NoTab', {
                      screen: 'HeroSettingNavigator',
                      params: {
                        screen: 'HeroShare',
                        params: {
                          heroNo,
                        },
                      },
                    });
                  }}
                />
              </ContentContainer>
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
        <ScreenContainer justifyContent={'space-between'}>
          <RoleItemList target={selectedLinkedUser} onSelect={updateRole} />
          <CtaButton active text="저장" onPress={handleClosePress} />
        </ScreenContainer>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
export default HeroModificationPage;
