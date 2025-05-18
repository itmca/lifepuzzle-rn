import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import CtaButton from '../../components/button/CtaButton';
import {AccountItem} from '../../components/hero/AccountItem';
import {AuthItemList} from '../../components/hero/AuthItemList';
import {LegacyBasicTextInput} from '../../components/input/LegacyBasicTextInput.tsx';
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
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {useHero} from '../../service/hooks/hero.query.hook';
import {HeroUserType, toPhotoIdentifier} from '../../types/hero.type';
import {
  useIsHeroUploading,
  useResetAllWritingHero,
  useUpdateHero,
} from '../../service/hooks/hero.update.hook.ts';
import {HeroPhotoCard} from '../../components/hero/HeroPhotoCard';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {Divider} from '../../components/styled/components/Divider';
import {userState} from '../../recoils/user.recoil.ts';
import {HeroAuthTypeCode} from '../../constants/auth.constant.ts';
import {BasicCard} from '../../components/card/Card.tsx';
import {Color} from '../../constants/color.constant.ts';
import BasicTextInput from '../../components/input/NewTextInput.tsx';
import {BasicButton} from '../../components/button/BasicButton.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

const HeroModificationPage = (): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();
  const heroNo = route.params.heroNo;

  //주인공 조회
  const {res} = useHero(heroNo);
  const {hero} = res;
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const [updateHero, isUpdating] = useUpdateHero();

  useEffect(() => {
    if (!hero) {
      return;
    }

    const currentPhoto = toPhotoIdentifier(hero.imageURL ?? '');
    setWritingHero({
      heroNo: heroNo,
      heroName: hero.heroName ?? '',
      heroNickName: hero.heroNickName,
      birthday: hero.birthday,
      isLunar: hero.isLunar,
      title: hero.title,
      imageURL: currentPhoto,
    });
  }, [hero]);

  const navigateToSelectingPhoto = () => {
    navigation.push('NoTab', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroSelectingPhoto',
      },
    });
  };
  const heroProfileImage = writingHero?.imageURL?.node.image.uri;

  return (
    <ScreenContainer>
      <LoadingContainer isLoading={isUpdating}>
        <ScrollContentContainer alignCenter withScreenPadding gap={32}>
          <ContentContainer
            aspectRatio={0.8701} //0.8701 =  335 / 385
          >
            <BasicCard
              photoUrls={heroProfileImage ? [heroProfileImage] : []}
              editable={true}
              fallbackIconName={'cameraAdd'}
              fallbackText={'클릭하여 프로필 이미지 추가'}
              fallbackBackgroundColor={Color.GREY_100}
              onPress={navigateToSelectingPhoto}
            />
          </ContentContainer>
          <ContentContainer alignCenter>
            <ContentContainer>
              <BasicTextInput
                label={'이름'}
                text={writingHero.heroName}
                onChangeText={heroName => setWritingHero({heroName})}
                placeholder="이름을 입력해 주세요"
              />
              <BasicTextInput
                label={'닉네임'}
                text={writingHero.heroNickName}
                onChangeText={heroNickName => setWritingHero({heroNickName})}
                placeholder="닉네임을 입력해 주세요"
              />
              <CustomDateInput
                label={'태어난 날'}
                date={writingHero.birthday}
                onDateChange={birthday => setWritingHero({birthday})}
              />
            </ContentContainer>
          </ContentContainer>
          <ContentContainer alignCenter>
            <BasicButton
              text={'저장하기'}
              onPress={() => updateHero()}
              disabled={
                hero?.heroName === writingHero.heroName &&
                hero?.heroNickName === writingHero.heroNickName &&
                hero?.birthday === writingHero.birthday &&
                hero?.isLunar === writingHero.isLunar &&
                !writingHero.isProfileImageUpdate
              }
            />
          </ContentContainer>
        </ScrollContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};
export default HeroModificationPage;
