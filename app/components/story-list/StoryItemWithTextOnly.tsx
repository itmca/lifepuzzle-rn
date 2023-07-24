import {GestureResponderEvent, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {StoryType} from '../../types/story.type';
import Image from '../styled/components/Image';
import {MediumText, SmallText, XSmallText} from '../styled/components/Text';
import {getStoryDisplayDate} from '../../service/story-display.service';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';

type props = {
  story: StoryType;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const TextOnlyContents = ({story, onPress}: props): JSX.Element => {
  const date = getStoryDisplayDate(story.date);

  return (
    <TouchableOpacity style={styles.onlyTextItemContainer} onPress={onPress}>
      <MediumText
        style={{...styles.itemTitle, marginBottom: 8}}
        color={Color.LIGHT_BLACK}
        fontWeight={500}
        numberOfLines={1}
        ellipsizeMode="tail">
        {story.title}
      </MediumText>
      {story.question && (
        <HorizontalContentContainer style={{marginBottom: 13}}>
          <Image
            source={require('../../assets/images/thumb-up-iso-color.png')}
            style={styles.thumbUpIcon}
          />
          <SmallText
            color={Color.DARK_GRAY}
            style={styles.questionText}
            fontWeight={'600'}
            numberOfLines={1}
            ellipsizeMode="tail">
            {story.question}
          </SmallText>
        </HorizontalContentContainer>
      )}
      <SmallText
        lineHeight={18}
        color={Color.FONT_GRAY}
        numberOfLines={2}
        ellipsizeMode="tail">
        {story.content}
      </SmallText>
      <XSmallText color={Color.FONT_GRAY} style={styles.date}>
        {date}
      </XSmallText>
    </TouchableOpacity>
  );
};
