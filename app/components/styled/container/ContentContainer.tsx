import styled from 'styled-components/native';

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
  backgroundcolor: ${props => props.backgroundColor ?? 'none'};
  zindex: ${props => props.zIndex ?? 'auto'};
  opacity: ${props => props.opacity ?? 100};
  border-radius: ${props => props.borderRadius ?? 0};
`;

export const HorizontalContentContainer = styled(ContentContainer)`
  flex-direction: row;
`;

export const OutLineContentContainer = styled(ContentContainer)`
  box-sizing: border-box;
  border: 16px solid #ffffff00;
`;
