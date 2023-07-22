import styled from 'styled-components/native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';

type Props = {
  width?: number;
  height?: number;
  source: ImageSourcePropType;
  tintColor?: string;
  backgroundColor?: string;
};
export const MediumImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '33.94px')};
  height: ${({height}) => (height ? `${height}px` : '33.25px')};
  justifycontent: center;
  aligncontent: center;
`;
export const SmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '20px')};
  height: ${({height}) => (height ? `${height}px` : '20px')};
  tintcolor: ${({tintColor}) => (tintColor ? `${tintColor}` : '')};
  backgroundcolor: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : ''};
  borderradius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
`;
export const XSmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '16px')};
  height: ${({height}) => (height ? `${height}px` : '16px')};
  tintcolor: ${({tintColor}) => (tintColor ? `${tintColor}` : '')};
  backgroundcolor: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : ''};
  borderradius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
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
