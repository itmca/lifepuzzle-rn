import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types';

import {Color} from '../../../constants/color.constant';
import {ContentContainer} from '../../styled/container/ContentContainer.tsx';
import {TouchableOpacity} from 'react-native';
import {BodyTextM} from '../../styled/components/Text.tsx';

const OtherLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <ContentContainer alignCenter>
      <TouchableOpacity
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'LoginRegisterNavigator',
            params: {
              screen: 'LoginOthers',
            },
          });
        }}>
        <BodyTextM color={Color.GREY_800} underline>
          다른 방법으로 로그인
        </BodyTextM>
      </TouchableOpacity>
    </ContentContainer>
  );
};

export default OtherLoginButton;
