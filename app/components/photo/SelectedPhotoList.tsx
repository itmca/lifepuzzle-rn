import React from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {Color} from '../../constants/color.constant';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import SelectedPhoto from './SelectedPhoto';
import {writingStoryState} from '../../recoils/story-write.recoil';

type SelectedPhotoListProps = {
  target?: 'all' | 'photo' | 'video';
  size?: number;
  upload?: boolean;
  cancel?: boolean;
};
const DeviceWidth = Dimensions.get('window').width - 15;
const SelectedPhotoList = ({
  target = 'photo',
  size = 10,
  upload = false,
  cancel = false,
}: SelectedPhotoListProps): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const writingStory = useRecoilValue(writingStoryState);

  const photoList =
    writingStory[target == 'all' || target == 'photo' ? 'photos' : 'videos'] ||
    [];
  if (photoList.length == 0) {
    return <></>;
  }
  return (
    <>
      <View style={{height: size + 10}}>
        <ScrollView horizontal={true} style={{width: DeviceWidth}}>
          {photoList.map((photo, index) => {
            return (
              <SelectedPhoto
                target={target}
                index={index}
                key={index}
                size={size}
                cancel={cancel}></SelectedPhoto>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default SelectedPhotoList;
