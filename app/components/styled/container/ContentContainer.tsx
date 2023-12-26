import styled, {css} from 'styled-components/native';

type ContentContainerProps = {
  width?: string;
  height?: string;
  minHeight?: string;
  flex?: number | string;
  gap?: string;
  padding?: number | string;
  position?: string;
  justifyContent?: string;
  alignItems?: string;
  marginTop?: string;
  marginBottom?: string;
  backgroundColor?: string;
  top?: number;
  bottom?: number;
  opacity?: number | string;
  zIndex?: number | string;
  borderRadius?: number;
  listThumbnail?: boolean;
  borderTopWidth?: number;
};

export const ContentContainer = styled.View<ContentContainerProps>`
  display: flex;
  flex-direction: column;
  width: ${props => props.width ?? '100%'};
  height: ${props => props.height ?? 'auto'};
  justify-content: ${props => props.justifyContent ?? 'flex-start'};
  align-items: ${props => props.alignItems ?? 'stretch'};
  gap: ${props => props.gap ?? '0px'};
  flex: ${props => props.flex ?? 'none'};
  top: ${props => props.top ?? 'auto'};
  bottom: ${props => props.bottom ?? 0};
  min-height: ${props => props.minHeight ?? '0px'};
  margin-top: ${props => props.marginTop ?? '0px'};
  margin-bottom: ${props => props.marginBottom ?? '0px'};
  padding: ${props => (props.padding ? props.padding + 'px' : '0px')};
  position: ${props => props.position ?? 'static'};
  background-color: ${props => props.backgroundColor ?? 'none'};
  z-index: ${props => props.zIndex ?? 0};
  opacity: ${props => props.opacity ?? 100};
  border-radius: ${props =>
    props.borderRadius ? props.borderRadius + 'px' : '0px'};

  ${props =>
    props.listThumbnail &&
    css`
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    `};
`;

export const HorizontalContentContainer = styled(ContentContainer)`
  flex-direction: row;
  margin-top: ${props => props.marginTop ?? '0px'};
  align-items: center;
`;

export const OutLineContentContainer = styled(ContentContainer)`
  box-sizing: border-box;
  border: 16px solid transparent;
  border-top-width: ${props =>
    props.borderTopWidth ? props.borderTopWidth + 'px' : '16px'};
`;
