import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types';
import {MediumButton} from '../../styled/components/Button';
import {Color} from '../../../constants/color.constant';
import MediumText from '../../styled/components/LegacyText.tsx';
import {ContentContainer} from '../../styled/container/ContentContainer.tsx';

const OtherLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <ContentContainer paddingHorizontal={8}>
      <MediumButton
        backgroundColor={Color.WHITE}
        justifyContent="flex-start"
        alignSelf="flex-start"
        width="auto"
        height={'40px'}
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'LoginRegisterNavigator',
            params: {
              screen: 'LoginOthers',
            },
          });
        }}>
        <MediumText color="#C4C4C4">다른 방법으로 로그인</MediumText>
      </MediumButton>
    </ContentContainer>
  );
};

export default OtherLoginButton;
