import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {StoryTag} from '../../types/story.type';
import Tag from '../styled/components/Tag';

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
    <Tag
      onPress={onPress}
      style={[
        {marginLeft: marginLeft, backgroundColor: backgroundColor},
      ]}
      text={tag.displayName}
      textColor={textColor}
    >
    </Tag>
  </>
);

export default StoryTagChip;
