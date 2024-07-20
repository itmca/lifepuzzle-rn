import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {MediumImage} from '../../components/styled/components/Image';
import React from 'react';

type PuzzleNumberProps = {
  displayNumber: number;
};

export const PuzzleNumber = ({
  displayNumber,
}: PuzzleNumberProps): JSX.Element => {
  const typeNo = displayNumber % 4;

  if (typeNo === 1) {
    return (
      <ContentContainer
        withContentPadding
        withNoBackground
        alignCenter
        height={'40px'}
        width={'48px'}>
        <MediumImage
          source={require('../../assets/images/puzzle-onepiece-type1.png')}
          width={41}
          height={35}
        />
      </ContentContainer>
    );
  } else if (typeNo === 2) {
    return (
      <ContentContainer
        withContentPadding
        withNoBackground
        alignCenter
        height={'40px'}
        width={'48px'}>
        <MediumImage
          source={require('../../assets/images/puzzle-onepiece-type2.png')}
          width={43}
          height={37}
        />
      </ContentContainer>
    );
  } else if (typeNo === 3) {
    return (
      <ContentContainer
        withContentPadding
        withNoBackground
        alignCenter
        height={'40px'}
        width={'48px'}>
        <MediumImage
          source={require('../../assets/images/puzzle-onepiece-type3.png')}
          width={40}
          height={40}
        />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      withContentPadding
      withNoBackground
      alignCenter
      height={'40px'}
      width={'48px'}>
      <MediumImage
        source={require('../../assets/images/puzzle-onepiece-type4.png')}
        width={42}
        height={42}
      />
    </ContentContainer>
  );
};
