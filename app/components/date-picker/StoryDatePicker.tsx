import React, {useEffect, useState} from 'react';
import {DateType} from '../../types/date.type';
import {AgePicker} from './AgePicker';
import {AgeGroupPicker} from './AgeGroupPicker';
import {MonthPicker} from './MonthPicker';
import {DayPicker} from './DayPicker';
import {StyleProp, View, ViewStyle} from 'react-native';

type Props = {
  dateType: DateType;
  heroName: string;
  birthday: Date;
  initialDate: Date;
  onChangeDate: (date: Date) => void;
  containerStyle?: StyleProp<ViewStyle> | undefined;
};

export const StoryDatePicker = ({
  dateType,
  heroName,
  birthday,
  initialDate,
  onChangeDate,
  containerStyle,
}: Props): JSX.Element => {
  const [storyDate, setStoryDate] = useState<Date>(initialDate);

  useEffect(() => {
    onChangeDate(storyDate);
  }, [storyDate]);

  let renderPicker = (
    <AgePicker
      heroName={heroName}
      initialAge={initialDate.getFullYear() - birthday.getFullYear() + 1}
      onChangeAge={(age: number) => {
        const storyYear = birthday.getFullYear() + age - 1;
        const newStoryDate = new Date(storyYear, 12, 0);
        setStoryDate(newStoryDate);
      }}
    />
  );

  if (dateType === DateType.AGE_GROUP) {
    renderPicker = (
      <AgeGroupPicker
        heroName={heroName}
        initialAge={initialDate.getFullYear() - birthday.getFullYear()}
        onChangeAgeGroup={ageGroup => {
          const storyYear = birthday.getFullYear() + ageGroup + 8;
          const newStoryDate = new Date(storyYear, 12, 0);
          setStoryDate(newStoryDate);
        }}
      />
    );
  }

  if (dateType === DateType.MONTH) {
    renderPicker = (
      <MonthPicker initialDate={new Date()} onChange={setStoryDate} />
    );
  }

  if (dateType === DateType.DAY) {
    renderPicker = (
      <DayPicker initialDate={new Date()} onChange={setStoryDate} />
    );
  }

  return <View style={containerStyle}>{renderPicker}</View>;
};
