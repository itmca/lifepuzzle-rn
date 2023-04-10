import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {StoryTag} from '../../types/story.type';

type Props = {
  tag: StoryTag;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  marginLeft: string | number;
};

const StoryTagChip = ({
  tag,
  onPress,
  backgroundColor,
  textColor,
  marginLeft,
}: Props): JSX.Element => (
  <>
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chipItem,
        {marginLeft: marginLeft, backgroundColor: backgroundColor},
      ]}>
      <Text style={[styles.chipText, {color: textColor}]}>
        {tag.displayName}
      </Text>
    </TouchableOpacity>
  </>
);

export default StoryTagChip;
