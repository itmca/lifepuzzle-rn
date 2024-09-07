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
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {
  HeroSettingNavigationProps,
  HeroSettingRouteProps,
} from '../../navigation/types';
import {
  getCurrentHeroPhotoUri,
  writingHeroState,
} from '../../recoils/hero-write.recoil';
import {useHero} from '../../service/hooks/hero.query.hook';
import {HeroUserType, toPhotoIdentifier} from '../../types/hero.type';
import {useIsHeroUploading} from '../../service/hooks/hero.update.hook.ts';
import {HeroPhotoCard} from '../../components/hero/HeroPhotoCard';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {Divider} from '../../components/styled/components/Divider';
import {userState} from '../../recoils/user.recoil.ts';
import {HeroAuthTypeCode} from '../../constants/auth.constant.ts';

const HeroModificationPage = (): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();
  const heroNo = route.params.heroNo;
  const isHeroUploading = useIsHeroUploading();
  const currentUser = useRecoilValue(userState);

  //주인공 조회
  const {res} = useHero(heroNo);
  const {hero, puzzleCnt, users, loading} = res;

  //초기값
  const [name, setName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState<string>('');

  const [linkedUsers, setLinkedUsers] = useState<HeroUserType[]>([]);
  const [currentUserAuth, setCurrentUserAuth] = useState<
    HeroAuthTypeCode | undefined
  >(undefined);
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
      setCurrentUserAuth(
        users
          .filter(user => user.userNo === currentUser.userNo)
          .map(user => user.auth)[0],
      );
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

  const [isLoading, deleteHero] = useAuthAxios<any>({
    requestOption: {
      url: `/heroes/${heroNo}`,
      method: 'delete',
    },
    onResponseSuccess: () => {
      CustomAlert.simpleAlert(`${hero.heroName}이 삭제되었습니다.`);
      // 주인공 관리 화면으로 이동
      navigation.push('NoTab', {
        screen: 'HeroSettingNavigator',
        params: {
          screen: 'HeroSetting',
        },
      });
    },
    onError: error => {
      console.log('error', error);
      CustomAlert.simpleAlert(
        `${hero.heroName} 삭제를 실패했습니다.\n잠시 후 다시 시도 부탁드립니다.`,
      );
    },
    disableInitialRequest: true,
  });

  const onHeroDelete = () => {
    CustomAlert.actionAlert({
      title: '주인공을 삭제하시겠습니까?',
      desc: '삭제 후 복원이 불가능합니다.',
      actionBtnText: '삭제',
      action: () => {
        deleteHero({});
      },
    });
  };

  return (
    <BottomSheetModalProvider>
      <ScrollContentContainer withScreenPadding>
        <LoadingContainer isLoading={loading || isHeroUploading}>
          <ContentContainer gap={32}>
            <ContentContainer alignItems={'center'}>
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
              <ContentContainer>
                <ContentContainer>
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
                <ContentContainer>
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
                <ContentContainer>
                  <XSmallTitle fontWeight={'600'} left={5}>
                    태어난 날
                  </XSmallTitle>
                  <CustomDateInput
                    label=""
                    date={birthday}
                    onChange={setBirthday}
                  />
                </ContentContainer>
                <ContentContainer>
                  <XSmallTitle fontWeight={'600'} left={5}>
                    연결 계정
                  </XSmallTitle>
                  {linkedUsers.map((selectedUser: HeroUserType, index) => (
                    <AccountItem
                      key={index}
                      user={selectedUser}
                      allowModification={
                        currentUserAuth === 'ADMIN' ||
                        currentUserAuth === 'OWNER'
                      }
                      onSelect={handlePresentModalPress}
                    />
                  ))}
                </ContentContainer>
              </ContentContainer>
              <ContentContainer gap={20}>
                <ContentContainer>
                  <CtaButton
                    active
                    text="연결 계정 추가"
                    onPress={openHeroSharePage}
                  />
                </ContentContainer>
                <Divider />
                <ContentContainer>
                  <CtaButton gray text="주인공 삭제" onPress={onHeroDelete} />
                </ContentContainer>
              </ContentContainer>
            </ContentContainer>
          </ContentContainer>
        </LoadingContainer>
      </ScrollContentContainer>
      <BottomSheet
        ref={bottomSheetModalRef}
        index={1}
        onDismiss={handleClosePress}>
        <ScrollContentContainer>
          <AuthItemList
            user={selectUser}
            onSelect={updateAuth}
            onClose={handleClosePress}
          />
        </ScrollContentContainer>
      </BottomSheet>
    </BottomSheetModalProvider>
  );
};
export default HeroModificationPage;
