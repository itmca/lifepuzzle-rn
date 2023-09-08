import {useSetRecoilState} from 'recoil';
import {isStoryUploading} from '../../recoils/story-writing.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from './update.hooks';
import {storyListUpdate} from '../../recoils/update.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useEffect} from 'react';

type Props = {
  storyKey: string;
};

export const useDeleteStory = ({storyKey}: Props): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setStoryloading = useSetRecoilState(isStoryUploading);
  const publishStoryListUpdate = useUpdatePublisher(storyListUpdate);

  const [isLoading, deleteStory] = useAuthAxios<any>({
    requestOption: {
      method: 'DELETE',
      url: `/story/${storyKey}`,
    },
    onResponseSuccess: () => {
      publishStoryListUpdate();
      navigation.navigate('HomeTab', {screen: 'Home'});
    },
    onError: err => {
      console.log(err);
      Alert.alert('스토리 삭제를 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setStoryloading(isLoading);
  }, [isLoading]);

  const submit = function () {
    deleteStory({
      data: {
        storyKey: storyKey,
      },
    });
  };

  return [
    () => {
      submit();
    },
  ];
};
