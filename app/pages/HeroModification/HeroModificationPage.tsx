import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import CtaButton from '../../components/button/CtaButton';
import {AccountItem} from '../../components/hero/AccountItem';
import {AuthItemList} from '../../components/hero/AuthItemList';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import BottomSheet from '../../components/styled/components/BottomSheet';
import {ImageButton} from '../../components/styled/components/Button';
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
import {selectedHeroPhotoState} from '../../recoils/hero.recoil';
import {useHero} from '../../service/hooks/hero.query.hook';
import {HeroUserType} from '../../types/hero.type';
import {useIsHeroUploading} from '../../service/hooks/hero.write.hook';
import {toPhotoIdentifier} from '../../types/hero.type';
import {styles} from './styles';

const HeroModificationPage = (): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();

  const heroNo = route.params.heroNo;
  const {res} = useHero(heroNo);
  const {hero, users, loading} = res;

  const [name, setName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState<string>('');

  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const currentHeroPhotoUri = useRecoilValue(getCurrentHeroPhotoUri);
  const [selectedHeroPhoto, setSelectedHeroPhoto] = useRecoilState(
    selectedHeroPhotoState,
  );
  const [selectedUsers, setSelectedUsers] = useState<HeroUserType[]>([]);
  const [selectUser, setSelectUser] = useState<HeroUserType>(undefined);

  const isHeroUploading = useIsHeroUploading();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // callbacks
  const handlePresentModalPress = useCallback((selectUser: HeroUserType) => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
    setSelectUser(selectUser);
  }, []);

  useEffect(() => {
    if (hero) {
      const currentPhoto = toPhotoIdentifier(hero.imageURL);

      setWritingHero({
        heroNo: heroNo,
        heroName: hero?.heroName ?? '',
        heroNickName: hero?.heroNickName,
        birthday: hero?.birthday,
        title: hero?.title,
        imageURL: currentPhoto ? currentPhoto : undefined,
      });

      setName(hero?.heroName);
      setNickName(hero?.heroNickName);
      setBirthday(hero?.birthday ? new Date(hero?.birthday) : new Date());
      setTitle(hero?.title || '');
      setSelectedUsers(users);
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
                {selectedUsers.map((selectedUser: HeroUserType, index) => (
                  <AccountItem
                    key={index}
                    user={selectedUser}
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
                          hero: {
                            heroNo: heroNo,
                            heroName: name,
                            heroNickName: nickName,
                          },
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
      <BottomSheet
        ref={bottomSheetModalRef}
        index={1}
        onDismiss={handleClosePress}>
        <ScreenContainer justifyContent={'space-between'}>
          <AuthItemList
            user={selectUser}
            selected={selectedUsers}
            onSelect={setSelectUser}
            onSelected={setSelectedUsers}
            onClose={handleClosePress}
          />
        </ScreenContainer>
      </BottomSheet>
    </BottomSheetModalProvider>
  );
};
export default HeroModificationPage;
