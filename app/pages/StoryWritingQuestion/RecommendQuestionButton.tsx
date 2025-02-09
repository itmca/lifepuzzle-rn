import React from 'react';
import {WideSelectable} from '../../components/styled/components/Selectable';
import {XSmallTitle} from '../../components/styled/components/Title';
import {LegacyColor} from '../../constants/color.constant';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {PuzzleNumber} from './PuzzleNumber';
import {Question} from '../../types/question.type';

type Props = {
  question?: Question | undefined;
  order: number;
  selected: boolean;
  onSelect: () => void;
};

export const RecommendQuestionButton = ({
  question,
  order,
  selected = false,
  onSelect,
}: Props): JSX.Element => {
  const defaultBackgroundColor =
    order % 2 == 1 ? LegacyColor.LIGHT_BLACK : LegacyColor.WHITE;
  const defaultFontColor =
    order % 2 == 1 ? LegacyColor.WHITE : LegacyColor.BLACK;

  if (!question || question.no < 0) {
    return (
      <WideSelectable
        backgroundColor={defaultBackgroundColor}
        selected={selected}
        disabled={selected}
        onPress={onSelect}>
        <ContentContainer alignCenter withNoBackground height={'36px'}>
          <XSmallTitle style={{color: defaultFontColor}}>
            선택하지 않음
          </XSmallTitle>
        </ContentContainer>
      </WideSelectable>
    );
  }

  return (
    <WideSelectable
      gap={'8px'}
      backgroundColor={defaultBackgroundColor}
      selected={selected}
      disabled={selected}
      onPress={onSelect}>
      <PuzzleNumber displayNumber={order} />
      <ContentContainer
        withNoBackground
        flex={1}
        minHeight={'40px'}
        justifyContent={'center'}>
        <XSmallTitle color={defaultFontColor}>{question.text}</XSmallTitle>
      </ContentContainer>
    </WideSelectable>
  );
};
