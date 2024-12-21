import {useEffect} from 'react';
import {Color} from '../../constants/color.constant.ts';
import {Photo} from '../../components/styled/components/Image.tsx';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {GalleryType, TagType} from '../../types/photo.type.ts';
import {TouchableOpacity} from 'react-native';
import {
  MediumTitle,
  SmallTitle,
} from '../../components/styled/components/Title.tsx';

type Props = {
  tag: TagType;
  data: GalleryType[];
  onClick: (index: GalleryType['id']) => void;
};

const GalleryCard = ({tag, data, onClick}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const count = data.length ?? 0;
  const topContainer =
    count == 1
      ? {width: '100%', height: '100%'}
      : count == 2
      ? {width: '100%', height: '50%'}
      : {width: '100%', height: '50%'};
  const bottomContainer =
    count == 1
      ? {width: '0%', height: '0%'}
      : count == 2
      ? {width: '100%', height: '50%'}
      : {width: '100%', height: '50%'};

  const container1 =
    count == 1
      ? {width: '100%', height: '100%'}
      : count == 2
      ? {width: '100%', height: '100%'}
      : {width: '50%', height: '100%'};
  const container2 =
    count == 1
      ? {width: '0%', height: '0%'}
      : count == 2
      ? {width: '0%', height: '0%'}
      : {width: '50%', height: '100%'};
  const container3 =
    count == 1
      ? {width: '0%', height: '0%'}
      : count == 2
      ? {width: '100%', height: '100%'}
      : count == 3
      ? {width: '100%', height: '100%'}
      : {width: '50%', height: '100%'};
  const container4 =
    count == 1
      ? {width: '0%', height: '0%'}
      : count == 2
      ? {width: '0%', height: '0%'}
      : count == 3
      ? {width: '0%', height: '0%'}
      : {width: '50%', height: '100%'};

  useEffect(() => {}, []);
  return (
    <>
      <ContentContainer paddingHorizontal={20}>
        <MediumTitle>
          {(tag?.key === 'under10' ? '10세 미만' : tag?.label) ?? ''}
        </MediumTitle>
      </ContentContainer>
      <ContentContainer paddingHorizontal={8}>
        <ContentContainer alignCenter gap={0}>
          <ContentContainer borderRadius={16} withBorder gap={0}>
            <TouchableOpacity
              activeOpacity={count > 0 ? 0.8 : 0}
              onPress={() => {
                if (count > 0) onClick(data[0].index);
              }}>
              {count > 0 ? (
                <ContentContainer gap={0}>
                  <ContentContainer
                    gap={0}
                    useHorizontalLayout
                    width={topContainer.width}
                    height={topContainer.height}>
                    {count >= 1 && (
                      <ContentContainer
                        gap={0}
                        borderRadius={8}
                        width={container1.width}
                        height={container1.height}>
                        <Photo
                          source={
                            data[0].url
                              ? {uri: data[0].url}
                              : require('../../assets/images/hero-default-profile.jpeg')
                          }
                        />
                      </ContentContainer>
                    )}
                    {count >= 3 && (
                      <ContentContainer
                        gap={0}
                        borderRadius={8}
                        width={container2.width}
                        height={container2.height}>
                        <Photo
                          source={
                            data[2].url
                              ? {uri: data[2].url}
                              : require('../../assets/images/hero-default-profile.jpeg')
                          }
                        />
                      </ContentContainer>
                    )}
                  </ContentContainer>
                  <ContentContainer
                    gap={0}
                    useHorizontalLayout
                    width={bottomContainer.width}
                    height={bottomContainer.height}>
                    {count >= 2 && (
                      <ContentContainer
                        gap={0}
                        borderRadius={8}
                        width={container3.width}
                        height={container3.height}>
                        <Photo
                          source={
                            data[1].url
                              ? {uri: data[1].url}
                              : require('../../assets/images/hero-default-profile.jpeg')
                          }
                        />
                      </ContentContainer>
                    )}
                    {count >= 4 && (
                      <ContentContainer
                        gap={0}
                        borderRadius={8}
                        width={container4.width}
                        height={container4.height}>
                        <Photo
                          source={
                            data[3].url
                              ? {uri: data[3].url}
                              : require('../../assets/images/hero-default-profile.jpeg')
                          }
                        />
                      </ContentContainer>
                    )}
                  </ContentContainer>
                  {count > 4 && (
                    <ContentContainer
                      absoluteRightPosition
                      absoluteBottomPosition
                      paddingHorizontal={8}
                      paddingVertical={8}
                      backgroundColor="transparent"
                      width={'auto'}
                      alignCenter>
                      <ContentContainer
                        borderRadius={32}
                        paddingHorizontal={10}
                        paddingVertical={10}
                        alignCenter
                        backgroundColor={Color.PRIMARY_LIGHT}>
                        <SmallTitle color={Color.WHITE}>
                          +{count - 4}
                        </SmallTitle>
                      </ContentContainer>
                    </ContentContainer>
                  )}
                </ContentContainer>
              ) : (
                <ContentContainer borderRadius={16} alignCenter height="100%">
                  <Photo
                    width={128}
                    height={128}
                    source={require('../../assets/images/no-image-photo.png')}
                  />
                  <MediumTitle fontWeight={'bold'}>No Image/Video</MediumTitle>
                </ContentContainer>
              )}
            </TouchableOpacity>
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
    </>
  );
};

export default GalleryCard;
