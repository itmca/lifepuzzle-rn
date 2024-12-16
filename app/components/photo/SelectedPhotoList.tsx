import React from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {useRecoilValue} from 'recoil';
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
  size = 2,
  cancel = false,
}: SelectedPhotoListProps): JSX.Element => {
  const writingStory = useRecoilValue(writingStoryState);

  const photoList =
    writingStory[
      target === 'all' || target === 'photo' ? 'photos' : 'videos'
    ] || [];
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
                cancel={cancel}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default SelectedPhotoList;
