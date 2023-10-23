import Modal from 'react-native-modal';

import {Image, View, Dimensions} from 'react-native';
import {SmallText} from '../styled/components/Text';
import styles from './styles';
import {
  PostStoryKeyState,
  isModalOpening,
} from '../../recoils/story-write.recoil';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {Color} from '../../constants/color.constant';
import {ModalButton} from '../button/ModalButton';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {StoryType} from '../../types/story.type';
import StoryViewNavigator from '../../navigation/no-tab/StoryViewNavigator';

type Props = {
  heroNickName: string;
  isModalOpen: boolean;
};
const WriteCompletedModal = ({
  heroNickName,
  isModalOpen,
}: Props): JSX.Element => {
  const setModalOpen = useSetRecoilState(isModalOpening);
  const navigation = useNavigation<BasicNavigationProps>();

  const postStoryKey = useRecoilValue(PostStoryKeyState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);

  const moveToStoryDetailPage = (id: StoryType['id']) => {
    setPostStoryKey(id);

    navigation.navigate('NoTab', {
      screen: 'StoryViewNavigator',
      params: {
        screen: 'Story',
      },
    });
  };

  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={isModalOpen}
      style={{justifyContent: 'flex-start', top: 100, alignItems: 'center'}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContentContainer}>
          <Image
            source={require('../../assets/images/celebration-character.png')}
            style={{marginBottom: 20}}
          />
          <SmallText color={Color.FONT_DARK} fontWeight={600}>
            {heroNickName}님의 퍼즐이 맞춰졌습니다!
          </SmallText>
        </View>
        <View style={styles.modalButtonContainer}>
          <ModalButton
            onPress={() => {
              navigation.navigate('HomeTab', {screen: 'Home'});
              setModalOpen(false);
            }}
            flexBasis="50%"
            backgroundColor="#F9F9F9"
            borderTopLeftRadius="0px"
            borderTopRightRadius="0px"
            borderBottomLeftRadius="8px"
            borderBottomRightRadius="0px"
            text="메인 바로 가기"
            fontColor="#B4B3B3"
            fontWeight="500"
          />
          <ModalButton
            onPress={() => {
              moveToStoryDetailPage(postStoryKey);
              setModalOpen(false);
            }}
            flexBasis="50%"
            backgroundColor="#FF6200"
            borderTopLeftRadius="0px"
            borderTopRightRadius="0px"
            borderBottomLeftRadius="0px"
            borderBottomRightRadius="8px"
            text="퍼즐 조각 보러가기"
            fontColor="#FFFFFF"
            fontWeight="700"
          />
        </View>
      </View>
    </Modal>
  );
};

export default WriteCompletedModal;
