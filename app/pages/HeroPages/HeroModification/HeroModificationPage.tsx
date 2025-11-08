import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {CustomDateInput} from '../../../components/input/CustomDateInput';
import {LoadingContainer} from '../../../components/loadding/LoadingContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/styled/container/ContentContainer';
import {
  HeroSettingNavigationProps,
  HeroSettingRouteProps,
} from '../../../navigation/types';
import {writingHeroState} from '../../../recoils/hero-write.recoil';
import {useHero} from '../../../service/hooks/hero.query.hook';
import {toPhotoIdentifier} from '../../../service/photo-identifier.service';
import {useUpdateHero} from '../../../service/hooks/hero.update.hook.ts';
import {Divider} from '../../../components/styled/components/Divider';
import {BasicCard} from '../../../components/card/Card.tsx';
import {Color} from '../../../constants/color.constant.ts';
import BasicTextInput from '../../../components/input/NewTextInput.tsx';
import {BasicButton} from '../../../components/button/BasicButton.tsx';
import {ScreenContainer} from '../../../components/styled/container/ScreenContainer.tsx';
import {useDeleteHero} from '../../../service/hooks/hero.delete.hook.ts';
import {CustomAlert} from '../../../components/alert/CustomAlert.tsx';

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
  const [deleteHero, isDeleting] = useDeleteHero();

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
      <LoadingContainer isLoading={isUpdating || isDeleting}>
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
          <Divider />
          <ContentContainer alignCenter>
            <BasicButton
              text={'삭제하기'}
              backgroundColor={Color.WHITE}
              textColor={Color.MAIN_DARK}
              borderColor={Color.MAIN_DARK}
              onPress={() =>
                CustomAlert.actionAlert({
                  title: '주인공을 삭제하시겠습니까?',
                  desc: '삭제 후 복원이 불가능합니다.',
                  actionBtnText: '삭제',
                  action: () => {
                    deleteHero();
                  },
                })
              }
            />
          </ContentContainer>
        </ScrollContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};
export default HeroModificationPage;
