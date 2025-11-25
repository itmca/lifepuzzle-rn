import React, { useState } from 'react';

import { useUserStore } from '../../../stores/user.store';
import { useAuthAxios } from '../../../service/core/auth-http.hook';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
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
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import { BasicButton } from '../../../components/ui/form/Button';
import { useUserWithdraw } from '../../../service/user/user.withdraw.hook.ts';
import { ProfileUpdateBottomSheet } from './components/bottom-sheet/ProfileUpdateBottomSheet.tsx';
import { PasswordUpdateBottomSheet } from './components/bottom-sheet/PasswordUpdateBottomSheet.tsx';

type AccountQueryResponse = {
  id: number;
  loginId: string;
  nickName: string;
  imageUrl: string;
  recentHeroNo: number;
  userType: 'general' | 'kakao' | 'apple' | 'none';
};
const AccountModificationPage = (): React.ReactElement => {
  // React hooks
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  // 글로벌 상태 관리
  const { user, setWritingUser } = useUserStore();

  // Custom hooks
  const [isUserLoading] = useAuthAxios<AccountQueryResponse>({
    requestOption: {
      url: `/v1/users/${String(user?.id)}`,
      method: 'GET',
    },
    onResponseSuccess: responseUser => {
      setWritingUser({ ...responseUser, isProfileImageUpdate: false });
    },
    disableInitialRequest: false,
  });

  const [withdraw, isWithdrawing] = useUserWithdraw();

  return (
    <LoadingContainer isLoading={isUserLoading || isWithdrawing}>
      <ScreenContainer>
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
                          withdraw();
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
                paddingVertical={16}
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
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AccountModificationPage;
