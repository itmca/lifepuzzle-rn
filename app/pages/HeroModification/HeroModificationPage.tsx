import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import CtaButton from '../../components/button/CtaButton';
import {AccountItem} from '../../components/hero/AccountItem';
import {AuthItemList} from '../../components/hero/AuthItemList';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import BottomSheet from '../../components/styled/components/BottomSheet';
import {XSmallTitle} from '../../components/styled/components/Title';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {
  HeroSettingNavigationProps,
  HeroSettingRouteProps,
} from '../../navigation/types';
import {
  getCurrentHeroPhotoUri,
  writingHeroState,
} from '../../recoils/hero-write.recoil';
import {useHero} from '../../service/hooks/hero.query.hook';
import {HeroUserType} from '../../types/hero.type';
import {useIsHeroUploading} from '../../service/hooks/hero.write.hook';
import {toPhotoIdentifier} from '../../types/hero.type';
import {styles} from './styles';
import {HeroPhotoCard} from '../../components/hero/HeroPhotoCard';

const HeroModificationPage = (): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();
  const heroNo = route.params.heroNo;
  const isHeroUploading = useIsHeroUploading();

  //주인공 조회
  const {res} = useHero(heroNo);
  const {hero, puzzleCnt, users, loading} = res;

  //초기값
  const [name, setName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState<string>('');

  const [linkedUsers, setLinkedUsers] = useState<HeroUserType[]>([]);
  const [selectUser, setSelectUser] = useState<HeroUserType>(undefined);

  //recoil 데이터
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const currentHeroPhotoUri = useRecoilValue(getCurrentHeroPhotoUri);

  //bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback((selectUser: HeroUserType) => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
    setSelectUser(selectUser);
  }, []);
  const updateAuth = (auth: string) => {
    setLinkedUsers(
      linkedUsers.map(item =>
        item.userNo === selectUser?.userNo ? {...selectUser, auth: auth} : item,
      ),
    );
    setSelectUser({...selectUser, auth: auth});
  };
  useEffect(() => {
    if (hero) {
      const currentPhoto = toPhotoIdentifier(hero.imageURL ?? '');
      setWritingHero({
        heroNo: heroNo,
        heroName: hero?.heroName ?? '',
        heroNickName: hero?.heroNickName,
        birthday: hero?.birthday,
        title: hero?.title,
        imageURL: currentPhoto,
      });

      setName(hero?.heroName);
      setNickName(hero?.heroNickName);
      setBirthday(hero?.birthday ? new Date(hero?.birthday) : new Date());
      setTitle(hero?.title || '');
      setLinkedUsers(users);
    }
  }, [loading]);

  useEffect(() => {
    setWritingHero({
      heroNo: heroNo,
      heroName: name,
      heroNickName: nickName,
      birthday: birthday,
      title: title,
    });
  }, [name, nickName, birthday, title]);

  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [loading]);

  const openHeroSharePage = () => {
    navigation.push('NoTab', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroShare',
        params: {
          hero: {
            heroNo: heroNo,
            heroName: name,
            heroNickName: nickName,
          },
        },
      },
    });
  };

  return (
    <BottomSheetModalProvider>
      <ScrollContainer
        contentContainerStyle={styles.formContainer}
        extraHeight={0}
        keyboardShouldPersistTaps={'always'}>
        <ScreenContainer>
          <LoadingContainer isLoading={loading || isHeroUploading}>
            <ContentContainer
              gap={'20px'}
              alignItems={'center'}
              padding={'0px 15'}>
              <HeroPhotoCard
                photoUri={writingHero?.imageURL?.node.image.uri}
                title={title}
                onChangeTitle={setTitle}
                puzzleCnt={puzzleCnt}
                onClick={() => {
                  navigation.push('NoTab', {
                    screen: 'HeroSettingNavigator',
                    params: {
                      screen: 'HeroSelectingPhoto',
                    },
                  });
                }}
              />
              <ContentContainer gap={'20px'}>
                <ContentContainer gap={'10px'}>
                  <XSmallTitle fontWeight={'600'} left={5}>
                    이름
                  </XSmallTitle>
                  <BasicTextInput
                    label=""
                    text={name}
                    onChangeText={setName}
                    placeholder="홍길동"
                  />
                </ContentContainer>
                <ContentContainer gap={'10px'}>
                  <XSmallTitle fontWeight={'600'} left={5}>
                    닉네임
                  </XSmallTitle>
                  <BasicTextInput
                    label=""
                    text={nickName}
                    onChangeText={setNickName}
                    placeholder="소중한 당신"
                  />
                </ContentContainer>
                <ContentContainer gap={'10px'}>
                  <XSmallTitle fontWeight={'600'} left={5}>
                    태어난 날
                  </XSmallTitle>
                  <CustomDateInput
                    label=""
                    date={birthday}
                    onChange={setBirthday}
                  />
                </ContentContainer>
                <ContentContainer gap={'10px'}>
                  <XSmallTitle fontWeight={'600'} left={5}>
                    연결 계정
                  </XSmallTitle>
                  {linkedUsers.map((selectedUser: HeroUserType, index) => (
                    <AccountItem
                      key={index}
                      user={selectedUser}
                      onSelect={handlePresentModalPress}></AccountItem>
                  ))}
                </ContentContainer>
              </ContentContainer>
              <ContentContainer>
                <CtaButton
                  active
                  text="연결 계정 추가"
                  onPress={openHeroSharePage}
                />
              </ContentContainer>
            </ContentContainer>
          </LoadingContainer>
        </ScreenContainer>
      </ScrollContainer>
      <BottomSheet
        ref={bottomSheetModalRef}
        index={1}
        onDismiss={handleClosePress}>
        <ScreenContainer justifyContent={'space-between'}>
          <AuthItemList
            user={selectUser}
            onSelect={updateAuth}
            onClose={handleClosePress}
          />
        </ScreenContainer>
      </BottomSheet>
    </BottomSheetModalProvider>
  );
};
export default HeroModificationPage;
