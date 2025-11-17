import React from 'react';
import { Pressable } from 'react-native';

import { SvgIcon } from '../../display/SvgIcon';
import { useUIStore } from '../../../../stores/ui.store';

type Props = {
  iconSize?: number;
  customAction?: Function;
};

const DetailViewHeaderRight = ({
  iconSize = 24,
  customAction,
}: Props): React.ReactElement => {
  const setOpenModal = useUIStore(state => state.setOpenDetailBottomSheet);
  return (
    <Pressable
      onPress={() => {
        setOpenModal(true);
        customAction && customAction();
      }}
    >
      <SvgIcon name={'kebab'} size={iconSize} />
    </Pressable>
  );
};

export default DetailViewHeaderRight;
