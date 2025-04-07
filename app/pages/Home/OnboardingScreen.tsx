import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {BodyTextM, Head} from '../../components/styled/components/Text';
import PageIndicator from '../../components/styled/components/PageIndicator';
import {BasicButton} from '../../components/button/BasicButton';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {LocalStorage} from '../../service/local-storage.service';

const DeviceWidth = Dimensions.get('window').width;

const slides = [
  {
    key: 'onboarding-slide1',
    index: 1,
    title: '사진과 영상을\n간편하게 추가하세요!',
    description:
      '몇 번의 터치만으로 추억을 남길 수 있어요\n쉽고 빠르게 업로드해 보세요!',
    image: require('../../assets/images/onboarding1.png'),
  },
  {
    key: 'onboarding-slide2',
    index: 2,
    title: '나이대별로 정리된\n우리 가족의 이야기',
    description:
      '연령별로 정리된 사진을 순서대로 보며,\n성장의 순간을 다시 느껴보세요',
    image: require('../../assets/images/onboarding2.png'),
  },
  {
    key: 'onboarding-slide3',
    index: 3,
    title: '가족이나 친구와 함께\n추억을 나누세요!',
    description:
      '소중한 순간을 함께하는 사람들과 공유하고,\n더 많은 이야기를 나눠보세요  ',
    image: require('../../assets/images/onboarding3.png'),
  },
];

const OnboardingScreen = ({navigation}: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isScrollToScroll = useRef(false); // 👈 플래그

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: DeviceWidth * (currentIndex + 1),
        animated: true,
      });
    } else {
      await LocalStorage.set('onboarding', 'true');
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeTab', params: {screen: 'Home'}}],
      });

      navigation.push('NoTab', {
        screen: 'LoginRegisterNavigator',
        params: {
          screen: 'LoginMain',
        },
      });
    }
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrollToScroll.current) {
      return;
    }
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / DeviceWidth);
    setCurrentIndex(pageIndex);
  };

  return (
    <ScreenContainer>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {slides.map(slide => (
          <ContentContainer
            key={slide.key}
            width={DeviceWidth + 'px'}
            paddingHorizontal={20}
            justifyContent={'center'}>
            <ContentContainer gap={16}>
              <Head color={Color.GREY_900}>{slide.title}</Head>
              <BodyTextM color={Color.GREY_600}>{slide.description}</BodyTextM>
            </ContentContainer>
            <ContentContainer alignCenter paddingTop={62}>
              <Image
                source={slide.image}
                style={{width: 275, height: 212, resizeMode: 'contain'}}
              />
            </ContentContainer>
          </ContentContainer>
        ))}
      </ScrollView>
      <ContentContainer alignCenter paddingBottom={160}>
        <ContentContainer width={'40px'}>
          <PageIndicator
            page={currentIndex + 1}
            size={slides.length}
            onChange={page => {
              isScrollToScroll.current = true;
              scrollRef.current?.scrollTo({x: (page - 1) * DeviceWidth});

              setCurrentIndex(page - 1);
              //ScrollView onScroll 작동 방지용(IOS)
              setTimeout(() => {
                isScrollToScroll.current = false;
              }, 500);
            }}
          />
        </ContentContainer>
        <ContentContainer
          absoluteBottomPosition
          paddingHorizontal={20}
          paddingBottom={50}>
          {currentIndex === slides.length - 1 && (
            <BasicButton
              onPress={handleNext}
              text={'로그인하고 추억 기록하러 가기'}
            />
          )}
        </ContentContainer>
      </ContentContainer>
    </ScreenContainer>
  );
};

export default OnboardingScreen;
