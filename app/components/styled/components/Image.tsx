import styled from 'styled-components/native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';

type Props = {
  width?: number;
  height?: number;
  source: ImageSourcePropType;
};
export const MediumImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '33.94px')};
  height: ${({height}) => (height ? `${height}px` : '33.25px')};
  justify-content: center;
  align-content: center;
`;
export const SmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '24px')};
  height: ${({height}) => (height ? `${height}px` : '23px')};
`;
export const LargeImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '94px')};
  height: ${({height}) => (height ? `${height}px` : '94px')};
  borderradius: 10px;
`;
export const Photo = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '100%')};
  height: ${({height}) => (height ? `${height}px` : '100%')};
`;

function Image({...props}) {
  return <MediumImage {...props} />;
}

export default Image;
