import {MediumButton} from '../../styled/components/Button';

import {Color} from '../../../constants/color.constant';
import {SmallText} from '../../styled/components/LegacyText.tsx';

import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types';

const RegisterButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <>
      <MediumButton
        backgroundColor={Color.WHITE}
        height={'auto'}
        width="auto"
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'LoginRegisterNavigator',
            params: {
              screen: 'Register',
            },
          });
        }}>
        <SmallText color={Color.GREY_800}>회원가입</SmallText>
      </MediumButton>
    </>
  );
};

export default RegisterButton;
