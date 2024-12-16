import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';

import styled, {css} from 'styled-components/native';

type Props = {
  width?: number;
  height?: number;
  source: ImageSourcePropType;
  tintColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  resizeMode?: string;
};

export const MediumImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '33.94px')};
  height: ${({height}) => (height ? `${height}px` : '100')};
  justify-content: center;
  align-content: center;
  border-radius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  resize-mode: ${({resizeMode}) => (resizeMode ? `${resizeMode}` : 'cover')};
`;
export const SmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '20px')};
  height: ${({height}) => (height ? `${height}px` : '20px')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  ${props =>
    props.tintColor &&
    css`
      tint-color: ${props.tintColor};
    `};
`;
export const XSmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '16px')};
  height: ${({height}) => (height ? `${height}px` : '16px')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  ${props =>
    props.tintColor &&
    css`
      tint-color: ${props.tintColor};
    `};
`;

export const XXSmallImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '14px')};
  height: ${({height}) => (height ? `${height}px` : '14px')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  ${props =>
    props.tintColor &&
    css`
      tint-color: ${props.tintColor};
    `};
`;
export const LargeImage = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '94px')};
  height: ${({height}) => (height ? `${height}px` : '94px')};
  border-radius: 10px;
`;
export const Photo = styled.Image<Props>`
  width: ${({width}) => (width ? `${width}px` : '100%')};
  height: ${({height}) => (height ? `${height}px` : '100%')};
  border-radius: ${({borderRadius}) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  resize-mode: ${({resizeMode}) => (resizeMode ? `${resizeMode}` : 'cover')};
`;

function Image({...props}) {
  return <MediumImage {...props} />;
}

export default Image;
