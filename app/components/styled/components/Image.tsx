import styled from 'styled-components/native';
import { MediumText } from "./Text";

type Props = {
  width?: number;
  height?: number;
};
const MediumImage = styled.Image<Props>`
   width: ${({ width }) => (width ? `${width}px` : '33.94px')};
   height: ${({ height }) => (height ? `${height}px` : '33.25px')};
 `;
export const SmallImage = styled.Image<Props>`
   width: ${({ width }) => (width ? `${width}px` : '24px')};
   height: ${({ height }) => (height ? `${height}px` : '23px')};
 `;
export const LargeImage = styled.Image<Props>`
   width: ${({ width }) => (width ? `${width}px` : '94px')};
   height: ${({ height }) => (height ? `${height}px` : '94px')};
   borderRadius: 10px;
 `;
export const Photo = styled.Image<Props>`
   width: ${({ width }) => (width ? `${width}px` : '100%')};
   height: ${({ height }) => (height ? `${height}px` : '100%')};
 `;

function Image({ ...props }) {
  return (
    <MediumImage {...props} >
    </MediumImage>
  );
}
export default Image;
