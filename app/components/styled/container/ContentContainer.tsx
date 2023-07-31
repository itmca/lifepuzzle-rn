import styled from 'styled-components/native';

type ContentContainerProps = {
  width?: string;
  height?: string;
  minHeight?: string;
  flex?: number | string;
  gap?: string;
  justifyContent?: string;
  alignItems?: string;
  marginTop?: string;
  marginBottom?: string;
};

export const ContentContainer = styled.View<ContentContainerProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent ?? 'flex-start'};
  align-items: ${props => props.alignItems ?? 'stretch'};
  gap: ${props => props.gap ?? '0px'};
  flex: ${props => props.flex ?? 'none'};
  height: ${props => (props.height ? `${props.height}` : 'auto')};
  min-height: ${props => props.minHeight ?? '0px'};
  margin-top: ${props => props.marginTop ?? '0px'};
  margin-bottom: ${props => props.marginBottom ?? '0px'};
`;

export const HorizontalContentContainer = styled(ContentContainer)`
  flex-direction: row;
`;

export const OutLineContentContainer = styled(ContentContainer)`
  box-sizing: border-box;
  border: 16px solid #ffffff00;
`;
