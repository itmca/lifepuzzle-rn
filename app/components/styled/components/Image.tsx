import styled from 'styled-components/native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';

type Props = {
  width?: number;
  height?: number;
  source: ImageSourcePropType;
  tintColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
};
export const MediumImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '33.94px')};
  height: ${({height}) => (height ? `${height}px` : '33.25px')};
  justify-content: center;
  align-content: center;
`;
export const SmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '20px')};
  height: ${({height}) => (height ? `${height}px` : '20px')};
  tint-color: ${({tintColor}) => (tintColor ? `${tintColor}` : 'transparent')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
`;
export const XSmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '16px')};
  height: ${({height}) => (height ? `${height}px` : '16px')};
  tint-color: ${({tintColor}) => (tintColor ? `${tintColor}` : 'transparent')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
`;
export const LargeImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '94px')};
  height: ${({height}) => (height ? `${height}px` : '94px')};
  border-radius: 10px;
`;
export const Photo = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '100%')};
  height: ${({height}) => (height ? `${height}px` : '100%')};
`;

function Image({...props}) {
  return <MediumImage {...props} />;
}

export default Image;
