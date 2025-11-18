import React, { useEffect, useMemo, useState } from 'react';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { AccountAvatar } from '../../../components/ui/display/Avatar';
import { BasicButton } from '../../../components/ui/form/Button';
import BottomSheet from '../../../components/ui/interaction/BottomSheet';
import { useUserAuthUpdate } from '../../../service/user/user.update.hook.ts';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { HeroType, HeroUserType } from '../../../types/core/hero.type';
import { Divider } from '../../../components/ui/base/Divider';
import { Radio } from '../../../components/ui/form/Radio';
import {
  HeroAuthTypeByCode,
  HeroAuthTypeCode,
  SortedHeroAuthTypes,
} from '../../../constants/auth.constant.ts';
import { BodyTextB } from '../../../components/ui/base/TextBase';

type Props = {
  opened: boolean;
  user?: HeroUserType;
  hero?: HeroType;
  onSuccess?: () => void;
  onClose?: () => void;
};

export const HeroAuthUpdateBottomSheet = ({
  opened,
  user,
  hero,
  onSuccess,
  onClose,
}: Props) => {
  const [updateUserAuth, isAuthUpdating] = useUserAuthUpdate({
    onSuccess: () => {
      onSuccess && onSuccess();
      if (user && newUserAuth) {
        user.auth = newUserAuth;
      }
    },
  });

  var snapPoints = useMemo(() => ['58%'], []);
  var [newUserAuth, setNewUserAuth] = useState<HeroAuthTypeCode>();

  useEffect(() => {
    if (!user) {
      return;
    }

    setNewUserAuth(user.auth);
  }, [user]);

  if (!user || !hero) {
    return <></>;
  }

  const authList = SortedHeroAuthTypes.filter(
    auth => auth.code !== 'OWNER',
  ).map(item => {
    return {
      label: item.name,
      value: item.code,
      description: item.description,
    };
  });

  return (
    <BottomSheet
      opened={opened}
      title={'권한 설정'}
      snapPoints={snapPoints}
      onClose={() => {
        onClose && onClose();
      }}
    >
      <ContentContainer alignCenter paddingVertical={16}>
        <ContentContainer useHorizontalLayout gap={12}>
          <ContentContainer width={'auto'}>
            <AccountAvatar
              size={52}
              imageUrl={user.imageUrl}
              iconSize={20}
              auth={user.auth}
            />
          </ContentContainer>
          <ContentContainer gap={2}>
            <BodyTextB>{user.nickName}</BodyTextB>
            <BodyTextB>{HeroAuthTypeByCode[user.auth].name}</BodyTextB>
          </ContentContainer>
        </ContentContainer>
        <ContentContainer gap={0}>
          {authList.map((i, index) => (
            <>
              {index !== 0 && <Divider marginVertical={0} />}
              <ContentContainer
                key={'share-auth-' + index}
                paddingVertical={14}
                gap={0}
                alignCenter
              >
                <Radio
                  selected={newUserAuth === i.value}
                  label={i.label}
                  value={i.value}
                  subLabel={i.description}
                  onSelect={value => {
                    setNewUserAuth(value as HeroAuthTypeCode);
                  }}
                />
              </ContentContainer>
            </>
          ))}
        </ContentContainer>
        <LoadingContainer isLoading={isAuthUpdating}>
          <BasicButton
            onPress={() => {
              updateUserAuth({
                userNo: user?.userNo,
                heroNo: hero?.heroNo,
                heroAuthStatus: newUserAuth || user?.auth,
              });
            }}
            disabled={!newUserAuth || user.auth === newUserAuth}
            text="저장하기"
          />
          {/*TODO(border-line): BE 연결 해제 API 작업 후에 작업 진행 */}
          {/*<TouchableOpacity*/}
          {/*  onPress={() => {}}>*/}
          {/*  <BodyTextM color={Color.GREY_800} underline>*/}
          {/*    연결 해제*/}
          {/*  </BodyTextM>*/}
          {/*</TouchableOpacity>*/}
        </LoadingContainer>
      </ContentContainer>
    </BottomSheet>
  );
};
