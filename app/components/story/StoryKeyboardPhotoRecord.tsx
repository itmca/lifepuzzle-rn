import {Avatar, Button, List} from 'react-native-paper';
import React from 'react';
import {I18nManager, View} from 'react-native';
import SelectedPhotoList from '../photo/SelectedPhotoList';
import {useRecoilValue} from 'recoil';
import {selectedPhotoState} from '../../recoils/selected-photo.recoil';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';

export const StoryKeyboardPhotoRecord = (): JSX.Element => {
  const selectedPhotoList = useRecoilValue(selectedPhotoState);
  return (
    <List.Accordion
      title={'사진 업로드 (선택)'}
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
            target={'photo'}
            size={80}
            photoList={selectedPhotoList}
          />
        }
      />
    </List.Accordion>
  );
};
