import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserStore } from '../../../stores/user.store';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { CustomAlert } from '../../../components/ui/feedback/CustomAlert';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { Color } from '../../../constants/color.constant';
import { TouchableOpacity } from 'react-native';
import { AccountAvatar } from '../../../components/ui/display/Avatar';
import {
  BodyTextM,
  Caption,
  Head,
  Title,
} from '../../../components/ui/base/TextBase';
import { BasicButton } from '../../../components/ui/form/Button';
import { useWithdrawUser } from '../../../services/user/user.mutation';
import { ProfileUpdateBottomSheet } from './components/bottom-sheet/ProfileUpdateBottomSheet.tsx';
import { PasswordUpdateBottomSheet } from './components/bottom-sheet/PasswordUpdateBottomSheet.tsx';
import { useAuthQuery } from '../../../services/core/auth-query.hook.ts';

type AccountQueryResponse = {
  id: number;
  loginId: string;
  nickName: string;
  imageUrl: string;
  recentHeroNo: number;
  userType: 'general' | 'kakao' | 'apple' | 'none';
};
const AccountSettingPage = (): React.ReactElement => {
  // React hooks
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  // 글로벌 상태 관리
  const { user, setWritingUser } = useUserStore();

  // Custom hooks
  const { data: responseUser, isFetching: isUserLoading } =
    useAuthQuery<AccountQueryResponse>({
      queryKey: ['user', user?.id],
      axiosConfig: {
        url: `/v1/users/${String(user?.id)}`,
        method: 'GET',
      },
      enabled: Boolean(user?.id),
    });

  const { withdrawUser, isPending: isWithdrawing } = useWithdrawUser();

  useEffect(() => {
    if (responseUser) {
      setWritingUser({ ...responseUser, profileImageUpdate: false });
    }
  }, [responseUser, setWritingUser]);

  return (
    <PageContainer
      edges={['left', 'right', 'bottom']}
      isLoading={isUserLoading || isWithdrawing}
    >
      {user && (
        <>
          <ContentContainer gap={8} alignCenter expandToEnd>
            <AccountAvatar imageUrl={user.imageUrl} size={100} />
            <ContentContainer gap={0} alignCenter>
              <Head>{user.nickName}</Head>
              {user?.userType === 'general' && (
                <Title color={Color.GREY_500}>{user.loginId}</Title>
              )}
            </ContentContainer>
          </ContentContainer>
          <ContentContainer withScreenPadding alignCenter paddingBottom={65}>
            <BasicButton
              text={'프로필 수정'}
              onPress={() => setProfileModalOpen(true)}
            />
            <ContentContainer>
              {user?.userType === 'general' && (
                <BasicButton
                  text="비밀번호 변경"
                  onPress={() => setPasswordModalOpen(true)}
                />
              )}
              <ContentContainer alignCenter>
                <TouchableOpacity
                  onPress={() => {
                    CustomAlert.actionAlert({
                      title: '회원탈퇴',
                      desc: '기록하셨던 주인공의 이야기를 포함하여 모든 데이터가 삭제됩니다. 탈퇴하시겠습니까?',
                      actionBtnText: '탈퇴',
                      action: () => {
                        withdrawUser();
                      },
                    });
                  }}
                >
                  <BodyTextM color={Color.GREY_800} underline>
                    회원 탈퇴
                  </BodyTextM>
                </TouchableOpacity>
              </ContentContainer>
            </ContentContainer>
            <ContentContainer
              gap={0}
              alignCenter
              absoluteBottomPosition
              paddingTop={16}
              paddingBottom={insets.bottom + 16}
            >
              <Caption color={Color.GREY_300}>designed by 박유나</Caption>
              <Caption color={Color.GREY_300}>
                developed by 오솔미 이시은 정주온 정지현
              </Caption>
            </ContentContainer>
          </ContentContainer>
        </>
      )}
      <ProfileUpdateBottomSheet
        opened={profileModalOpen}
        onSuccess={() => setProfileModalOpen(false)}
        onClose={() => setProfileModalOpen(false)}
      />
      <PasswordUpdateBottomSheet
        opened={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </PageContainer>
  );
};
export default AccountSettingPage;
