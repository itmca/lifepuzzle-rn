import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Color} from '../../constants/color.constant';
import MediumText from '../styled/components/Text';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  visible: boolean;
  onClickEdit: (event: GestureResponderEvent) => void;
  onClickDelete: (event: GestureResponderEvent) => void;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 100,
    height: 90,
    zIndex: 999,
    right: 20,
    top: 40,
    borderRadius: 6,
    backgroundColor: Color.WHITE,
    borderWidth: 1,
    borderColor: Color.LIGHT_GRAY,
    shadowColor: Color.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eachMenuButton: {
    height: '50%',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Color.LIGHT_GRAY,
  },
});

export const FloatingMenu = ({
  visible = false,
  onClickEdit,
  onClickDelete,
}: Props): JSX.Element => {
  if (!visible) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.eachMenuButton} onPress={onClickEdit}>
        <Icon size={20} color={Color.LIGHT_BLACK} name="rotate-cw" />
        <MediumText color={Color.LIGHT_BLACK} fontWeight={600}>
          수정
        </MediumText>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.eachMenuButton} onPress={onClickDelete}>
        <Icon size={20} name="trash-2" color={Color.LIGHT_BLACK} />
        <MediumText color={Color.LIGHT_BLACK} fontWeight={600}>
          삭제
        </MediumText>
      </TouchableOpacity>
    </View>
  );
};
