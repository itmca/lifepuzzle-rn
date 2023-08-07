import {TouchableOpacity, GestureResponderEvent, View} from 'react-native';
import {styles} from './styles';
import MediumText, {SmallText} from '../styled/components/Text';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import Icon from 'react-native-vector-icons/AntDesign';

type props = {
  title: string;
  content: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const Contents = ({title, content, onPress}: props): JSX.Element => {
  return (
    <View style={styles.contentsContainer}>
      <MediumText
        style={styles.itemTitle}
        numberOfLines={1}
        ellipsizeMode="tail">
        {title}
      </MediumText>
      <MediumText
        style={styles.description}
        numberOfLines={1}
        ellipsizeMode="tail">
        {content}
      </MediumText>
      <TouchableOpacity onPress={onPress}>
        <HorizontalContentContainer
          justifyContent="flex-end"
          alignItems="center">
          <SmallText color={Color.LIGHT_BLACK}>자세히 보기 </SmallText>
          <Icon name="right" color={Color.LIGHT_BLACK} size={14} />
        </HorizontalContentContainer>
      </TouchableOpacity>
    </View>
  );
};
