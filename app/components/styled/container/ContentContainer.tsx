import styled from 'styled-components/native';

type ContentContainerProps = {
  width?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  flex?: number | string;
  minHeight?: number;
};

export const ContentContainer = styled.View<ContentContainerProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'stretch')};
  gap: ${props => props.gap ?? '0px'};
  flex: ${props => props.flex ?? 'none'};
  min-height: ${props => props.minHeight ?? '0'};
`;

export const HorizontalContentContainer = styled(ContentContainer)<{
  height?: string;
  marginTop?: string;
  alignItems?: string;
}>`
  flex-direction: row;
  align-items: ${props => (props.alignItems ? props.alignItems : 'stretch')};
  height: ${props => (props.height ? props.height : 'auto')};
  margin-top: ${props => (props.marginTop ? props.marginTop : '0px')};
  gap: 8px;
`;

export const OutLineContentContainer = styled(ContentContainer)`
  box-sizing: border-box;
  border: 16px solid #ffffff00;
`;
