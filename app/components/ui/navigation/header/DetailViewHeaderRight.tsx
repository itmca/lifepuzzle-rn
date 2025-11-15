import React from 'react';
import {Pressable} from 'react-native';
import {useRecoilState} from 'recoil';
import {OpenDetailBottomSheet} from '../../../../recoils/content/story-view.recoil';
import {SvgIcon} from '../../display/SvgIcon';

type Props = {
  iconSize?: number;
  customAction?: Function;
};

const DetailViewHeaderRight = ({
  iconSize = 24,
  customAction,
}: Props): JSX.Element => {
  const [openModal, setOpenModal] = useRecoilState(OpenDetailBottomSheet);
  return (
    <Pressable
      onPress={() => {
        setOpenModal(true);
        customAction && customAction();
      }}>
      <SvgIcon name={'kebab'} size={iconSize} />
    </Pressable>
  );
};

export default DetailViewHeaderRight;
