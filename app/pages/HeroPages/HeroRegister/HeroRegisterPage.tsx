import React from 'react';

import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { useHeroStore } from '../../../stores/hero.store';
import { BasicButton } from '../../../components/ui/form/Button';
import { useCreateHero } from '../../../services/hero/hero.mutation';
import { HeroFormContent } from '../components/HeroFormContent';

const HeroRegisterPage = (): React.ReactElement => {
  // 글로벌 상태 관리
  const { writingHero, setWritingHero } = useHeroStore();

  // Custom hooks
  const { createHero, isPending: isLoading } = useCreateHero();

  return (
    <PageContainer edges={['left', 'right', 'bottom']} isLoading={isLoading}>
      <ScrollContainer keyboardAware>
        <HeroFormContent
          writingHero={writingHero}
          onChangeHero={setWritingHero}
        />
        <ContentContainer alignCenter withScreenPadding paddingTop={0}>
          <BasicButton
            text={'추가하기'}
            onPress={() => createHero()}
            disabled={
              !writingHero?.name ||
              !writingHero?.nickName ||
              !writingHero?.birthday
            }
          />
        </ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};

export { HeroRegisterPage };
