import {MediumButton} from '../../styled/components/Button';
import MediumText from '../../styled/components/Text';
import {Color} from '../../../constants/color.constant';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types';

const RegisterButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <MediumButton
      backgroundColor={Color.WHITE}
      justifyContent="flex-start"
      alignSelf="flex-start"
      padding="12px 9px"
      marginBottom="0px"
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
  );
};

export default RegisterButton;
