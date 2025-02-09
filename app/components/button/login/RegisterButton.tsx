import {MediumButton} from '../../styled/components/Button';
import {LegacyColor} from '../../../constants/color.constant';
import MediumText from '../../styled/components/LegacyText.tsx';

import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types';
import {ContentContainer} from '../../styled/container/ContentContainer.tsx';

const RegisterButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <ContentContainer paddingHorizontal={8}>
      <MediumButton
        backgroundColor={LegacyColor.WHITE}
        justifyContent="flex-start"
        alignSelf="flex-start"
        height={'40px'}
        width="auto"
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'LoginRegisterNavigator',
            params: {
              screen: 'Register',
            },
          });
        }}>
        <MediumText color="#C4C4C4">회원가입</MediumText>
      </MediumButton>
    </ContentContainer>
  );
};

export default RegisterButton;
