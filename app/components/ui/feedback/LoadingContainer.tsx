import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Color } from '../../../constants/color.constant.ts';

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
};

export const LoadingContainer = ({
  isLoading,
  children,
}: Props): React.ReactElement => {
  return (
    <View style={{ flex: 1, width: '100%', position: 'relative' }}>
      {children}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Color.WHITE,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            animating={true}
            color={Color.MAIN_LIGHT}
            size={40}
          />
        </View>
      )}
    </View>
  );
};
