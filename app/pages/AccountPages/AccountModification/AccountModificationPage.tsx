import React, {useState} from 'react';

import {useUserStore} from '../../../stores/user.store';
import {useAuthAxios} from '../../../service/core/auth-http.hook';
import {LoadingContainer} from '../../../components/ui/feedback/LoadingContainer';
import {CustomAlert} from '../../../components/ui/feedback/CustomAlert';
import {ContentContainer} from '../../../components/ui/layout/ContentContainer.tsx';
import {Color} from '../../../constants/color.constant';
import {TouchableOpacity} from 'react-native';
import {AccountAvatar} from '../../../components/ui/display/Avatar';
import {
  BodyTextM,
  Caption,
  Head,
  Title,
} from '../../../components/ui/base/TextBase';
import {ScreenContainer} from '../../../components/ui/layout/ScreenContainer';
import {BasicButton} from '../../../components/ui/form/Button';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useUserWithdraw} from '../../../service/user/user.withdraw.hook.ts';
import {ProfileUpdateBottomSheet} from './components/BottomSheet/ProfileUpdateBottomSheet.tsx';
import {PasswordUpdateBottomSheet} from './components/BottomSheet/PasswordUpdateBottomSheet.tsx';

type AccountQueryResponse = {
  userNo: number;
  userId: string;
  userNickName: string;
  imageURL: string;
  recentHeroNo: number;
  userType: 'general' | 'kakao' | 'apple' | 'none';
};
const AccountModificationPage = (): JSX.Element => {
  const {user, setWritingUser} = useUserStore();

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  const [isUserLoading] = useAuthAxios<AccountQueryResponse>({
    requestOption: {
      url: `/v1/users/${String(user?.userNo)}`,
      method: 'GET',
    },
    onResponseSuccess: responseUser => {
      setWritingUser({...responseUser, isProfileImageUpdate: false});
    },
    disableInitialRequest: false,
  });

  const [withdraw, isWithdrawing] = useUserWithdraw();

  return (
    <LoadingContainer isLoading={isUserLoading || isWithdrawing}>
      <ScreenContainer>
        <ContentContainer gap={8} alignCenter expandToEnd>
          <AccountAvatar imageURL={user.imageUrl} size={100} />
          <ContentContainer gap={0} alignCenter>
            <Head>{user.userNickName}</Head>
            {user?.userType === 'general' && (
              <Title color={Color.GREY_500}>{user.userId}</Title>
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
                }}>
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
            paddingVertical={16}>
            <Caption color={Color.GREY_300}>designed by 박유나</Caption>
            <Caption color={Color.GREY_300}>
              developed by 오솔미 이시은 정주온 정지현
            </Caption>
          </ContentContainer>
        </ContentContainer>
        <BottomSheetModalProvider>
          <ProfileUpdateBottomSheet
            opened={profileModalOpen}
            onSuccess={() => setProfileModalOpen(false)}
            onClose={() => setProfileModalOpen(false)}
          />
          <PasswordUpdateBottomSheet
            opened={passwordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
          />
        </BottomSheetModalProvider>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AccountModificationPage;
