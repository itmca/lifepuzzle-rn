import React, { memo } from 'react';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { AccountAvatar } from '../../../../components/ui/display/Avatar';
import {
  BodyTextB,
  BodyTextM,
  Title,
} from '../../../../components/ui/base/TextBase';
import { Color } from '../../../../constants/color.constant.ts';
import { SvgIcon } from '../../../../components/ui/display/SvgIcon';
import {
  HeroAuthTypeByCode,
  HeroAuthTypeCode,
} from '../../../../constants/auth.constant.ts';
import { HeroUserType } from '../../../../types/core/hero.type';

type ConnectedAccountsSectionProps = {
  users: HeroUserType[];
  currentUserId?: number;
  currentUserAuth?: HeroAuthTypeCode;
  onSettingPress: (user: HeroUserType) => void;
};

const ConnectedAccountsSectionComponent = ({
  users,
  currentUserId,
  currentUserAuth,
  onSettingPress,
}: ConnectedAccountsSectionProps): React.ReactElement => {
  const canManageAuth =
    currentUserAuth === 'OWNER' || currentUserAuth === 'ADMIN';

  return (
    <ContentContainer withScreenPadding paddingTop={0} paddingBottom={4}>
      <Title>연결된 계정</Title>

      {users.map((linkedUser, index) => {
        const canEditThisUser =
          canManageAuth &&
          linkedUser.auth !== 'OWNER' &&
          linkedUser.id !== currentUserId;

        return (
          <ContentContainer
            key={index}
            alignItems={'center'}
            justifyContent={'flex-start'}
            height={52}
            useHorizontalLayout
            gap={12}
          >
            <ContentContainer useHorizontalLayout flex={1} expandToEnd>
              <AccountAvatar
                imageUrl={linkedUser.imageUrl}
                size={52}
                auth={linkedUser.auth}
                iconSize={20}
                iconPadding={0}
              />
              <ContentContainer gap={2}>
                <BodyTextB color={Color.GREY_800}>
                  {linkedUser.nickName}
                </BodyTextB>
                <BodyTextM
                  color={
                    linkedUser.auth === 'OWNER'
                      ? Color.SUB_CORAL
                      : linkedUser.auth === 'ADMIN'
                        ? Color.SUB_TEAL
                        : Color.MAIN_DARK
                  }
                >
                  {HeroAuthTypeByCode[linkedUser.auth].name}
                </BodyTextM>
              </ContentContainer>
            </ContentContainer>
            <ContentContainer width={'auto'}>
              {canEditThisUser && (
                <SvgIcon
                  name={'setting'}
                  size={24}
                  onPress={() => onSettingPress(linkedUser)}
                />
              )}
            </ContentContainer>
          </ContentContainer>
        );
      })}
    </ContentContainer>
  );
};

export const ConnectedAccountsSection = memo(ConnectedAccountsSectionComponent);
