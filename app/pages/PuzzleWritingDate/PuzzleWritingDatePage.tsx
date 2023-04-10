import React, {useState} from 'react';
import HelpQuestion from '../../components/help-question/HelpQuestion';
import SelectableChips from '../../components/chips/SelectableChips';
import {styles} from './styles';
import {StoryDatePicker} from '../../components/date-picker/StoryDatePicker';
import {HeroType} from '../../types/hero.type';
import {useRecoilState, useRecoilValue} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {DateType} from '../../types/date.type';
import {storyDateState} from '../../recoils/story-writing.recoil';
import {KeyboardAvoidingView} from 'react-native';

type DateTypeDisplay = {
  dateType: DateType;
  displayText: string;
};
const dateTypeDisplays: DateTypeDisplay[] = [
  {dateType: DateType.AGE, displayText: '나이'},
  {dateType: DateType.AGE_GROUP, displayText: '나이대'},
  {dateType: DateType.MONTH, displayText: '날짜(월)'},
  {dateType: DateType.DAY, displayText: '날짜(일)'},
];

const PuzzleWritingDatePage = (): JSX.Element => {
  const [dateType, setDateType] = useState<DateType>(DateType.AGE);
  const [_, setStoryDate] = useRecoilState<Date | undefined>(storyDateState);
  const hero = useRecoilValue<HeroType>(heroState);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <HelpQuestion />
      <SelectableChips
        chips={dateTypeDisplays.map(display => display.displayText)}
        initialSelected={dateType}
        onSelect={dateTypeText => {
          const matchedDateType = dateTypeDisplays.find(
            display => display.displayText === dateTypeText,
          );
          setDateType(matchedDateType?.dateType || dateType);
        }}
        containerStyle={styles.chipsContainer}
      />
      <StoryDatePicker
        birthday={hero.birthday || new Date()}
        dateType={dateType}
        heroName={hero?.heroNickName || ''}
        initialDate={new Date()}
        onChangeDate={setStoryDate}
        containerStyle={styles.datePickerContainer}
      />
    </KeyboardAvoidingView>
  );
};

export default PuzzleWritingDatePage;
