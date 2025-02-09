import {List} from 'react-native-paper';
import React from 'react';
import {Dimensions} from 'react-native';
import SelectedPhotoList from '../photo/SelectedPhotoList';
import {SmallImage} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import MediumText, {SmallText} from '../styled/components/LegacyText.tsx';

const DeviceWidth = Dimensions.get('window').width;
export const StoryKeyboardVideoRecord = (): JSX.Element => {
  return (
    <List.Accordion
      title={
        <MediumText>
          동영상 업로드 <SmallText color={Color.DARK_GRAY}>(선택)</SmallText>
        </MediumText>
      }
      right={props => (
        <SmallImage
          borderRadius={30}
          tintColor={props.isExpanded ? Color.LIGHT_GRAY : Color.DARK_GRAY}
          backgroundColor={
            props.isExpanded ? Color.PRIMARY_LIGHT : Color.LIGHT_GRAY
          }
          source={
            props.isExpanded
              ? require('../../assets/images/expand_less.png')
              : require('../../assets/images/expand_more.png')
          }
        />
      )}>
      <List.Item
        title={<SelectedPhotoList target={'video'} size={80} upload={true} />}
        titleStyle={{width: DeviceWidth}}
        style={{height: 120}}
      />
    </List.Accordion>
  );
};
