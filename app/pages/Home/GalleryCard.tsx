import {useEffect, useState} from 'react';
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
import {createThumbnail} from 'react-native-create-thumbnail';

type Props = {
  tag: TagType;
  data: GalleryType[];
  onClick: (index: GalleryType['id']) => void;
};
type MediaProps = {
  item: GalleryType;
};
const Media = ({item}: MediaProps): JSX.Element => {
  const [thumbnailUrl, setThumbnailUri] = useState<string>(item.url);
  const createThumbnailUrl = async () => {
    const response = await createThumbnail({
      url: item.url,
    });
    setThumbnailUri(response.path);
  };
  useEffect(() => {
    if (item.type === 'VIDEO') {
      void createThumbnailUrl();
    }
  }, [item.url]);

  if (item.type === 'IMAGE') {
    return (
      <Photo
        source={
          item.url
            ? {uri: item.url}
            : require('../../assets/images/no-image-photo.png')
        }
      />
    );
  } else if (item.type === 'VIDEO') {
    return (
      <Photo
        source={
          item.url
            ? {uri: thumbnailUrl}
            : require('../../assets/images/no-image-photo.png')
        }
      />
    );
  }
  return <></>;
};
const GalleryCard = ({tag, data, onClick}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const count = data.length ?? 0;
  const topContainer = count == 1 ? {flex: 1} : {flex: 0.5};
  const bottomContainer = count == 1 ? {flex: 0} : {flex: 0.5};

  const container1 =
    count == 1 ? {flex: 1} : count == 2 ? {flex: 1} : {flex: 0.5};
  const container2 =
    count == 1 ? {flex: 0} : count == 2 ? {flex: 0} : {flex: 0.5};
  const container3 =
    count == 1
      ? {flex: 0}
      : count == 2
      ? {flex: 1}
      : count == 3
      ? {flex: 1}
      : {flex: 0.5};
  const container4 =
    count == 1
      ? {flex: 0}
      : count == 2
      ? {flex: 0}
      : count == 3
      ? {flex: 0}
      : {flex: 0.5};

  useEffect(() => {}, []);
  return (
    <>
      <ContentContainer gap={0} flex={1}>
        <MediumTitle>{tag?.label ?? ''}</MediumTitle>
        <ContentContainer paddingHorizontal={8} paddingVertical={8} flex={1}>
          <ContentContainer
            borderRadius={16}
            withBorder
            gap={0}
            paddingVertical={0}>
            {count > 0 ? (
              <TouchableOpacity
                activeOpacity={count > 0 ? 0.8 : 0}
                style={{backgroundColor: 'blue'}}
                onPress={() => {
                  if (count > 0) onClick(data[0].index);
                }}>
                <ContentContainer gap={1} height={'100%'}>
                  <ContentContainer
                    gap={1}
                    useHorizontalLayout
                    flex={topContainer.flex}>
                    {count >= 1 && (
                      <ContentContainer gap={0} flex={container1.flex}>
                        <Media item={data[0]} />
                      </ContentContainer>
                    )}
                    {count >= 3 && (
                      <ContentContainer gap={0} flex={container2.flex}>
                        <Media item={data[2]} />
                      </ContentContainer>
                    )}
                  </ContentContainer>
                  <ContentContainer
                    gap={1}
                    useHorizontalLayout
                    flex={bottomContainer.flex}>
                    {count >= 2 && (
                      <ContentContainer gap={0} flex={container3.flex}>
                        <Media item={data[1]} />
                      </ContentContainer>
                    )}
                    {count >= 4 && (
                      <ContentContainer gap={0} flex={container4.flex}>
                        <Media item={data[3]} />
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
              </TouchableOpacity>
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
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
    </>
  );
};

export default GalleryCard;
