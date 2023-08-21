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
  top?: string;
  bottom?: string;
  opacity?: string | number;
  zIndex?: number | string;
};

export const ContentContainer = styled.View<ContentContainerProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent ?? 'flex-start'};
  align-items: ${props => props.alignItems ?? 'stretch'};
  gap: ${props => props.gap ?? '0px'};
  flex: ${props => props.flex ?? 'none'};
  height: ${props => props.height ?? 'auto'};
  top: ${props => props.top ?? 'auto'};
  bottom: ${props => props.bottom ?? '0px'};
  min-height: ${props => props.minHeight ?? '0px'};
  margin-top: ${props => props.marginTop ?? '0px'};
  margin-bottom: ${props => props.marginBottom ?? '0px'};
  padding: ${props => (props.padding ? props.padding + 'px' : '0px')};
  position: ${props => props.position ?? 'static'};
  backgroundcolor: ${props => props.backgroundColor ?? 'none'};
  zindex: ${props => props.zIndex ?? 'auto'};
  opacity: ${props => props.opacity ?? 100};
`;

export const HorizontalContentContainer = styled(ContentContainer)`
  flex-direction: row;
`;

export const OutLineContentContainer = styled(ContentContainer)`
  box-sizing: border-box;
  border: 16px solid #ffffff00;
`;
