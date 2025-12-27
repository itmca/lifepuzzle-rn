import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { HeroSettingRouteProps } from '../../../navigation/types';
import { useHeroStore } from '../../../stores/hero.store';
import { useHero } from '../../../services/hero/hero.query';
import { toPhotoIdentifier } from '../../../utils/photo-identifier.util.ts';
import {
  useDeleteHero,
  useUpdateHero,
} from '../../../services/hero/hero.mutation';
import { Divider } from '../../../components/ui/base/Divider';
import { Color } from '../../../constants/color.constant.ts';
import { BasicButton } from '../../../components/ui/form/Button';
import { CustomAlert } from '../../../components/ui/feedback/CustomAlert';
import { HeroFormContent } from '../components/HeroFormContent';

const HeroModificationPage = (): React.ReactElement => {
  // 글로벌 상태 관리
  const { writingHero, setWritingHero } = useHeroStore();

  // 외부 hook 호출 (navigation, route 등)
  const route = useRoute<HeroSettingRouteProps<'HeroModification'>>();

  // Derived value or local variables
  const heroNo = route.params.heroNo;

  // Custom hooks
  const { hero, isLoading } = useHero(heroNo);
  const { updateHero, isPending: isUpdating } = useUpdateHero();
  const { deleteHero, isPending: isDeleting } = useDeleteHero();

  // Side effects
  useEffect(() => {
    if (!hero || writingHero.id === heroNo) {
      return;
    }

    const currentPhoto = hero.imageUrl
      ? toPhotoIdentifier(hero.imageUrl)
      : undefined;
    setWritingHero({
      id: heroNo,
      name: hero.name ?? '',
      nickName: hero.nickName,
      birthday: hero.birthday,
      isLunar: hero.isLunar,
      imageUrl: hero.imageUrl,
      modifiedImage: currentPhoto,
    });
  }, [hero, heroNo, setWritingHero, writingHero.id]);

  return (
    <PageContainer
      edges={['left', 'right', 'bottom']}
      isLoading={isLoading || isUpdating || isDeleting}
    >
      <ScrollContainer keyboardAware>
        <HeroFormContent
          writingHero={writingHero}
          onChangeHero={setWritingHero}
        />
        <ContentContainer alignCenter withScreenPadding paddingTop={0} gap={32}>
          <BasicButton
            text={'저장하기'}
            onPress={() => updateHero()}
            disabled={
              hero?.name === writingHero.name &&
              hero?.nickName === writingHero.nickName &&
              hero?.birthday === writingHero.birthday &&
              hero?.isLunar === writingHero.isLunar &&
              !writingHero.profileImageUpdate
            }
          />
          <Divider />
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
      </ScrollContainer>
    </PageContainer>
  );
};
export { HeroModificationPage };
