import React from 'react';
import {FlatList, ListRenderItemInfo, SafeAreaView} from 'react-native';

import {useRecoilState} from 'recoil';
import {SelectedCategoryState} from '../../recoils/selected-category.recoil';

import StoryTagChip from './StoryTagChip';
import {styles} from './styles';
import {StoryTag} from '../../types/story.type';
import {FILTER_KEY_ALL} from "../../constants/filter.contant";

type Props = {
  tags: StoryTag[];
  onSelect: (tagKey: string) => void;
};

const SwipingStoryTagChips = ({tags, onSelect}: Props): JSX.Element => {
  const [selectedKey, setSelectedKey] = useRecoilState(SelectedCategoryState);

  function renderSingleStoryTag({
    item: storyTag,
  }: ListRenderItemInfo<StoryTag>) {
    const backgroundColor =
      storyTag.key === selectedKey ? '#010440' : '#E5E5E5';
    const marginLeft = storyTag.key === 'all' ? 16 : 0;
    const color =
      storyTag.key === selectedKey ? '#ffffff' : 'rgba(0, 0, 0, 0.87);';

    return (
      <StoryTagChip
        tag={storyTag}
        onPress={() => {
          setSelectedKey(storyTag.key);
          onSelect(storyTag.key);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
        marginLeft={marginLeft}
      />
    );
  }

  return (
    <SafeAreaView style={styles.chipContainer}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={[
          {
            key: FILTER_KEY_ALL,
            displayName: '전체',
            priority: 0,
          },
          ...tags,
        ]}
        renderItem={renderSingleStoryTag}
        keyExtractor={item => item.key}
        horizontal={true}
      />
    </SafeAreaView>
  );
};

export default SwipingStoryTagChips;
