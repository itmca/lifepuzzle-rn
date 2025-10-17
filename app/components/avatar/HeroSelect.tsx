import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Color} from '../../constants/color.constant.ts';
import {Profile} from '../styled/components/Profile.tsx';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {HeroType} from '../../types/hero.type.ts';
import {BodyTextB, BodyTextM} from '../styled/components/Text.tsx';
import {Photo} from '../styled/components/Image.tsx';

type Props = {
  item: HeroType;
  selected?: boolean;
  onSelect: () => void;
};

export const HeroSelect = ({item, selected, onSelect}: Props): JSX.Element => {
  return (
    <TouchableOpacity onPress={onSelect}>
      <ContentContainer gap={8}>
        <ContentContainer
          width={52}
          height={52}
          alignCenter
          style={{borderWidth: selected ? 3 : 0}}
          borderColor={Color.MAIN}
          borderRadius={20}
          backgroundColor={Color.GREY_100}>
          {item.imageURL ? (
            <Photo source={{uri: item.imageURL}} />
          ) : (
            <Profile />
          )}
        </ContentContainer>

        <ContentContainer gap={0} alignCenter>
          <BodyTextB color={Color.GREY_800}>{item.heroNickName}</BodyTextB>
          <BodyTextM color={Color.GREY_400}>{item.heroName}</BodyTextM>
        </ContentContainer>
      </ContentContainer>
    </TouchableOpacity>
  );
};
