import {Button, List} from 'react-native-paper';
import React from 'react';
import {SmallText} from '../styled/components/Text';
import {I18nManager, View} from 'react-native';
import {SmallImage} from '../styled/components/Image';
import {usePhotos} from '../../service/hooks/photo.hook';
import {useRecoilValue} from 'recoil';
import {
  selectedPhotoState,
  selectedVideoState,
} from '../../recoils/selected-photo.recoil';
import SelectedPhotoList from '../photo/SelectedPhotoList';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';

export const StoryKeyboardVideoRecord = (): JSX.Element => {
  const selectedVideoList = useRecoilValue(selectedVideoState);
  return (
    <List.Accordion
      title={'영상 업로드 (선택)'}
      right={props => (
        <View style={{backgroundColor: '#F6F6F6', borderRadius: 30}}>
          <MaterialCommunityIcon
            name={props.isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
          />
        </View>
      )}>
      <List.Item
        title={
          <SelectedPhotoList
            target={'video'}
            size={80}
            photoList={selectedVideoList}
          />
        }
      />
    </List.Accordion>
  );
};
