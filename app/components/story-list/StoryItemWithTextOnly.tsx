import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {StoryType} from '../../types/story.type';
import Image from '../styled/components/Image';
import Text from '../styled/components/Text';
import {getStoryDisplayDate} from '../../service/story-display.service';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';

type props = {
  story: StoryType;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const TextOnlyContents = ({story, onPress}: props): JSX.Element => {
  const date = getStoryDisplayDate(story.date);

  return (
    <TouchableOpacity style={styles.onlyTextItemContainer} onPress={onPress}>
      <Text
        style={{...styles.itemTitle, marginBottom: 8}}
        numberOfLines={1}
        ellipsizeMode="tail">
        {story.title}
      </Text>
      {story.question && (
        <HorizontalContentContainer>
          <Image
            source={require('../../assets/images/thumb-up-iso-color.png')}
            style={styles.thumbUpIcon}
          />
          <Text
            style={styles.questionText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {story.question}
          </Text>
        </HorizontalContentContainer>
      )}
      <Text
        style={styles.onlyTextContent}
        numberOfLines={2}
        ellipsizeMode="tail">
        {story.content}
      </Text>
      <Text style={styles.date}>{date}</Text>
    </TouchableOpacity>
  );
};
