import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { Color } from '../../../constants/color.constant.ts';

type Props = {
  isLoading: boolean;
  children: React.ReactElement | React.ReactElement[];
};

export const LoadingContainer = ({
  isLoading,
  children,
}: Props): React.ReactElement => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <ActivityIndicator
      animating={true}
      color={Color.MAIN_LIGHT}
      size={40}
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.WHITE,
      }}
    />
  );
};
