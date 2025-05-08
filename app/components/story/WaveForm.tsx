import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';
interface WaveformProps {
  data: number[];
  progress: number;
}

export default function Waveform({data, progress}: WaveformProps) {
  const activeIndex = Math.floor(progress * data.length);

  return (
    <View style={styles.container}>
      {data.map((height, index) => {
        const isActive = index < activeIndex;
        return (
          <View key={index} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: `${height * 100}%`,
                  backgroundColor: isActive ? Color.SUB_CORAL : Color.GREY_400,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: Color.WHITE, // 연핑크 배경
    paddingVertical: 2,
  },
  barContainer: {
    width: 2,
    marginHorizontal: 3, // 막대 간격
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 2,
    borderRadius: 2, // 둥글게
  },
});
