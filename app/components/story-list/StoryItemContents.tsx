import {Text, TouchableOpacity, GestureResponderEvent} from 'react-native';
import {styles} from './styles';

type props = {
  title: string;
  content: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const Contents = ({title, content, onPress}: props): JSX.Element => {
  return (
    <TouchableOpacity style={styles.contentsContainer} onPress={onPress}>
      <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
        {content}
      </Text>
    </TouchableOpacity>
  );
};
