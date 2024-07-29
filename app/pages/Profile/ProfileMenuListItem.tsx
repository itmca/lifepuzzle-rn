import {TouchableOpacity} from 'react-native';
import MediumText from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

type Props = {
  backgroundColor?: string;
  listItemTitle: string;
  onPress: () => void;
};

export const ProfileMenuListItem = ({
  backgroundColor = Color.WHITE,
  listItemTitle,
  onPress,
}: Props): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 50,
        backgroundColor: Color.LIGHT_GRAY,
        marginLeft: 'auto',
      }}
      onPress={onPress}>
      <ContentContainer
        useHorizontalLayout
        withScreenPadding
        alignItems="center"
        backgroundColor={backgroundColor}>
        <MediumText color={Color.FONT_DARK} fontWeight={500}>
          {listItemTitle}
        </MediumText>

        <Icon
          disabled
          name={'chevron-right'}
          size={24}
          color={Color.FONT_GRAY}
        />
      </ContentContainer>
    </TouchableOpacity>
  );
};
