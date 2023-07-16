import {ContentContainer} from '../styled/container/ContentContainer';
import {MediumImage} from '../styled/components/Image';
import {SmallTitle} from '../styled/components/Title';
import {Color} from '../../constants/color.constant';
import React from 'react';

type PuzzleNumberProps = {
  displayNumber: number;
};

export const PuzzleNumber = ({
  displayNumber,
}: PuzzleNumberProps): JSX.Element => {
  const paddedDisplayNumber = displayNumber.toString().padStart(2, '0');
  const typeNo = displayNumber % 4;

  if (typeNo === 1) {
    return (
      <ContentContainer
        style={{height: 42, width: 42, justifyContent: 'center'}}>
        <MediumImage
          source={require('../../assets/images/puzzle-onepiece-type1.png')}
          width={41}
          height={35}
        />
        <SmallTitle style={{position: 'absolute', left: 10, fontWeight: 700}}>
          {paddedDisplayNumber}
        </SmallTitle>
      </ContentContainer>
    );
  } else if (typeNo === 2) {
    return (
      <ContentContainer
        style={{height: 42, width: 42, justifyContent: 'center'}}>
        <MediumImage
          source={require('../../assets/images/puzzle-onepiece-type2.png')}
          width={41}
          height={35}
        />
        <SmallTitle
          style={{
            position: 'absolute',
            left: 9,
            top: 13,
            fontWeight: 700,
            color: Color.WHITE,
          }}>
          {paddedDisplayNumber}
        </SmallTitle>
      </ContentContainer>
    );
  } else if (typeNo === 3) {
    return (
      <ContentContainer
        style={{height: 42, width: 42, justifyContent: 'center'}}>
        <MediumImage
          source={require('../../assets/images/puzzle-onepiece-type3.png')}
          width={40}
          height={40}
        />
        <SmallTitle
          style={{
            position: 'absolute',
            left: 9,
            top: 12,
            fontWeight: 700,
          }}>
          {paddedDisplayNumber}
        </SmallTitle>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer style={{height: 42, width: 42, justifyContent: 'center'}}>
      <MediumImage
        source={require('../../assets/images/puzzle-onepiece-type4.png')}
        width={40}
        height={40}
      />
      <SmallTitle
        style={{
          position: 'absolute',
          left: 9,
          top: 13,
          fontWeight: 700,
          color: Color.WHITE,
        }}>
        {paddedDisplayNumber}
      </SmallTitle>
    </ContentContainer>
  );
};
