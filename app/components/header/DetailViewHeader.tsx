import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import React, {useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {FloatingMenu} from '../story/StoryDetailFloatingMenu';
import Icon from 'react-native-vector-icons/Feather';
import {Color} from '../../constants/color.constant';
import {useRecoilValue} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {useDeleteStory} from '../../service/hooks/story.delete.hook';

type Props = {
  customAction?: Function;
};

const DetailViewHeader = ({customAction}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [deleteStory] = useDeleteStory({storyKey: storyKey});

  const onClickEdit = () => {
    // TODO 수정화면으로 이동시 파라미터 확인하기
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });

    setIsShowMenu(false);
  };

  const onClickDelete = () => {
    Alert.alert('', '삭제하시겠습니까?', [
      {
        text: '확인',
        onPress: () => {
          deleteStory();
        },
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };

  return (
    <TopNavigationContainer>
      <Pressable
        onPress={() => {
          if (typeof customAction === 'function') {
            customAction();
          }

          navigation.goBack();
        }}>
        <View style={{marginLeft: -10}}>
          <Icon name={'chevron-left'} size={26} color={Color.FONT_GRAY} />
        </View>
      </Pressable>
      <Pressable
        style={{marginLeft: 'auto'}}
        onPress={() => {
          setIsShowMenu(isShowMenu ? false : true);
        }}>
        <Icon
          name="more-vertical"
          size={23}
          color={Color.FONT_GRAY}
          style={{marginRight: -5}}
        />
      </Pressable>
      <FloatingMenu
        visible={isShowMenu}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
    </TopNavigationContainer>
  );
};

export default DetailViewHeader;
