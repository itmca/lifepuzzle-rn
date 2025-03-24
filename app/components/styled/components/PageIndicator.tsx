import {ActiveDot, Dot} from './Dot';
import {TouchableOpacity} from 'react-native';
import {ContentContainer} from '../container/ContentContainer';
import {useEffect, useState} from 'react';
type Props = {
  page?: number;
  size: number;
  onChange?: (page: number) => void;
};

function PageIndicator({page = 1, size, onChange}: Props) {
  const [curPage, setCurPage] = useState<number>(page);
  const pages = [];

  for (let i = 1; i <= size; i++) {
    if (i === curPage) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => {
            setCurPage(i);
            onChange && onChange(i);
          }}>
          <ActiveDot />
        </TouchableOpacity>,
      );
    } else {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => {
            setCurPage(i);
            onChange && onChange(i);
          }}
          style={{
            padding: 1,
          }}>
          <Dot />
        </TouchableOpacity>,
      );
    }
  }

  return (
    <ContentContainer width={'auto'} useHorizontalLayout gap={8}>
      {pages}
    </ContentContainer>
  );
}
export default PageIndicator;
