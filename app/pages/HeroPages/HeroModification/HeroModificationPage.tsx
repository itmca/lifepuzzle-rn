import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import {
  HeroSettingNavigationProps,
  HeroSettingRouteProps,
} from '../../../navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useHeroStore } from '../../../stores/hero.store';
import { useHero } from '../../../services/hero/hero.query.hook';
import { toPhotoIdentifier } from '../../../utils/photo-identifier.util.ts';
import { useUpdateHero } from '../../../services/hero/hero.update.hook.ts';
import { Divider } from '../../../components/ui/base/Divider';
import { BasicCard } from '../../../components/ui/display/Card';
import { Color } from '../../../constants/color.constant.ts';
import BasicTextInput from '../../../components/ui/form/TextInput.tsx';
import { BasicButton } from '../../../components/ui/form/Button';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import { useDeleteHero } from '../../../services/hero/hero.delete.hook.ts';
import { CustomAlert } from '../../../components/ui/feedback/CustomAlert';
import { CustomDateInput } from '../../../components/ui/interaction/CustomDateInput.tsx';
import { getHeroImageUri } from '../../../utils/hero-image.util';
import logger from '../../../utils/logger.util';

const HeroModificationPage = (): React.ReactElement => {
  // 글로벌 상태 관리
  const { writingHero, setWritingHero } = useHeroStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();

  // Derived value or local variables
  const heroNo = route.params.heroNo;

  // Custom hooks
  //주인공 조회
  const [hero, isLoading] = useHero(heroNo);
  const [updateHero, isUpdating] = useUpdateHero();
  const [deleteHero, isDeleting] = useDeleteHero();

  // Side effects
  useEffect(() => {
    if (!hero || writingHero.id === heroNo) {
      return;
    }

    logger.debug(`Initializing writingHero for heroNo: ${heroNo}`);

    const currentPhoto = hero.imageUrl
      ? toPhotoIdentifier(hero.imageUrl)
      : undefined;
    setWritingHero({
      id: heroNo,
      name: hero.name ?? '',
      nickName: hero.nickName,
      birthday: hero.birthday,
      isLunar: hero.isLunar,
      title: hero.title,
      imageUrl: hero.imageUrl,
      modifiedImage: currentPhoto,
    });
  }, [hero, heroNo, setWritingHero, writingHero.id]);

  const heroProfileImage = getHeroImageUri(writingHero);

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <LoadingContainer isLoading={isLoading || isUpdating || isDeleting}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bottomOffset={20}
        >
          <ContentContainer alignCenter withScreenPadding gap={32}>
            <ContentContainer
              aspectRatio={0.8701} //0.8701 =  335 / 385
            >
              <BasicCard
                photoUrls={heroProfileImage ? [heroProfileImage] : []}
                editable={true}
                fallbackIconName={'cameraAdd'}
                fallbackText={'클릭하여 프로필 이미지 추가'}
                fallbackBackgroundColor={Color.GREY_100}
                onPress={() => {
                  navigation.navigate('App', {
                    screen: 'HeroSettingNavigator',
                    params: {
                      screen: 'HeroProfileSelector',
                    },
                  });
                }}
              />
            </ContentContainer>
            <ContentContainer alignCenter>
              <ContentContainer>
                <BasicTextInput
                  label={'이름'}
                  text={writingHero.name ?? ''}
                  onChangeText={name => setWritingHero({ name })}
                  placeholder="이름을 입력해 주세요"
                />
                <BasicTextInput
                  label={'닉네임'}
                  text={writingHero.nickName ?? ''}
                  onChangeText={nickName => setWritingHero({ nickName })}
                  placeholder="닉네임을 입력해 주세요"
                />
                <CustomDateInput
                  label={'태어난 날'}
                  date={writingHero.birthday}
                  onDateChange={birthday => setWritingHero({ birthday })}
                />
              </ContentContainer>
            </ContentContainer>
            <ContentContainer alignCenter>
              <BasicButton
                text={'저장하기'}
                onPress={() => updateHero()}
                disabled={
                  hero?.name === writingHero.name &&
                  hero?.nickName === writingHero.nickName &&
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
          </ContentContainer>
        </KeyboardAwareScrollView>
      </LoadingContainer>
    </ScreenContainer>
  );
};
export default HeroModificationPage;
