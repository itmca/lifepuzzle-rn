import {TouchableOpacity} from 'react-native';

import {LegacyColor} from '../../constants/color.constant';
import MediumText from '../../components/styled/components/LegacyText.tsx';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

type Props = {
  backgroundColor?: string;
  listItemTitle: string;
  onPress: () => void;
};

export const ProfileMenuListItem = ({
  backgroundColor = LegacyColor.WHITE,
  listItemTitle,
  onPress,
}: Props): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 50,
        backgroundColor: LegacyColor.LIGHT_GRAY,
        marginLeft: 'auto',
      }}
      onPress={onPress}>
      <ContentContainer
        useHorizontalLayout
        withScreenPadding
        alignItems="center"
        backgroundColor={backgroundColor}>
        <MediumText color={LegacyColor.FONT_DARK} fontWeight={500}>
          {listItemTitle}
        </MediumText>

        <Icon
          disabled
          name={'chevron-right'}
          size={24}
          color={LegacyColor.FONT_GRAY}
        />
      </ContentContainer>
    </TouchableOpacity>
  );
};
