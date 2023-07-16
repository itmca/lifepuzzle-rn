import {List} from 'react-native-paper';
import React from 'react';
import {Dimensions, View} from 'react-native';
import SelectedPhotoList from '../photo/SelectedPhotoList';
import Image from '../styled/components/Image';
import Text from '../styled/components/Text';
import {styles} from './styles';

const DeviceWidth = Dimensions.get('window').width;
export const StoryKeyboardPhotoRecord = (): JSX.Element => {
  return (
    <List.Accordion
      title={
        <>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 16}}>사진 업로드 </Text>
            <Text style={{fontSize: 14, color: '#B4B3B3'}}>(선택)</Text>
          </View>
        </>
      }
      right={props => (
        <View style={styles.uploadIconContainer}>
          <Image
            style={styles.uploadIcon}
            source={
              props.isExpanded
                ? require('../../assets/images/expand_more.png')
                : require('../../assets/images/expand_less.png')
            }
          />
        </View>
      )}>
      <List.Item
        title={<SelectedPhotoList target={'photo'} size={80} />}
        titleStyle={{width: DeviceWidth}}
        style={{height: 120}}
      />
    </List.Accordion>
  );
};
