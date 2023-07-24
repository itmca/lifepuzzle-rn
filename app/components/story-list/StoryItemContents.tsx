import {TouchableOpacity, GestureResponderEvent} from 'react-native';
import {styles} from './styles';
import MediumText from '../styled/components/Text';

type props = {
  title: string;
  content: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const Contents = ({title, content, onPress}: props): JSX.Element => {
  return (
    <TouchableOpacity style={styles.contentsContainer} onPress={onPress}>
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
    </TouchableOpacity>
  );
};
