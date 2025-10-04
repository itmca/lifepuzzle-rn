import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {
  BodyTextB,
  BodyTextM,
  Caption,
  Title,
} from '../../components/styled/components/Text';
import {BasicNavigationProps} from '../../navigation/types';
import {formatDateToTodayOrYYMMDD} from '../../service/date-time-display.service';
import {Photo} from '../../components/styled/components/Image';
import {useAiGalleries} from '../../service/hooks/ai-photo.query.hook';
import {AiGallery} from '../../types/ai-photo.type';

interface WorkItem {
  id: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdBy?: string;
  requestedAt: string;
  completedAt: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

const AiPhotoWorkHistoryPage = (): JSX.Element => {
  const screenWidth = Dimensions.get('window').width;
  const {gallery} = useAiGalleries();
  const [inProgressItems, setInProgressItems] = useState<AiGallery[]>([]);
  const [completedItems, setCompletedItems] = useState<AiGallery[]>([]);
  useEffect(() => {
    if (gallery && gallery.length > 0) {
      setInProgressItems(gallery.filter(item => item.status === 'IN_PROGRESS'));
      setCompletedItems(gallery.filter(item => item.status === 'COMPLETED'));
    }
  }, [gallery]);
  const renderWorkItem = (item: WorkItem) => {
    const itemWidth = (screenWidth - 48) / 2; // 좌우 패딩 20px씩, 아이템 간격 20px

    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemWidth,
          marginBottom: 20,
        }}>
        <ContentContainer gap={8}>
          <ContentContainer
            flex={1}
            backgroundColor={Color.GREY_700}
            borderRadius={6}
            height={itemWidth * 0.85}>
            <Photo source={{uri: item.thumbnailUrl}} style={{flex: 1}} />
          </ContentContainer>
          {item.status !== 'COMPLETED' ? (
            <ContentContainer
              useHorizontalLayout
              gap={6}
              justifyContent={'flex-start'}>
              <BodyTextM color={Color.GREY_700}>
                {formatDateToTodayOrYYMMDD(item.requestedAt)}{' '}
              </BodyTextM>
              <BodyTextB color={Color.AI_500}>생성중...</BodyTextB>
            </ContentContainer>
          ) : (
            <>
              <BodyTextB color={Color.GREY_700}>by {item.createdBy}</BodyTextB>
              <ContentContainer gap={0}>
                <Caption color={Color.GREY_300}>
                  {formatDateToTodayOrYYMMDD(item.requestedAt)} 요청
                </Caption>
                <Caption color={Color.GREY_300}>
                  {formatDateToTodayOrYYMMDD(item.completedAt)} 완료
                </Caption>
              </ContentContainer>
            </>
          )}
        </ContentContainer>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <ScrollContentContainer>
        <ContentContainer withContentPadding paddingVertical={24} gap={32}>
          <BodyTextM color={Color.GREY_500} style={{marginTop: 8}}>
            일반적으로 약 <BodyTextM color={Color.AI_500}>2</BodyTextM>분 정도
            소요되며,{'\n'}
            다른 화면으로 이동해도 문제없이 완료돼요.
          </BodyTextM>

          {inProgressItems.length > 0 && (
            <ContentContainer gap={12}>
              <Title color={Color.GREY_900}>진행중인 내역</Title>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                {inProgressItems.map(renderWorkItem)}
              </View>
            </ContentContainer>
          )}
          <ContentContainer gap={12}>
            <Title color={Color.GREY_900}>완료된 내역</Title>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              {completedItems.map(renderWorkItem)}
            </View>
          </ContentContainer>
        </ContentContainer>
      </ScrollContentContainer>
    </ScreenContainer>
  );
};

export default AiPhotoWorkHistoryPage;
