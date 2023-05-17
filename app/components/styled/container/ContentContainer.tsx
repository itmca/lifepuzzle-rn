import styled from 'styled-components/native';

type Props = {
  width?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  flex?: number | string;
};

export const ContentContainer = styled.View<Props>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'stretch')};
  gap: ${props => props.gap ?? '0px'};
  flex: ${props => props.flex ?? 'none'};
`;

// horizontal
export const ContentContainerRow = styled(ContentContainer)<{height?: string}>`
  flex-direction: row;
  align-items: center;
  height: ${props => props.height ?? 'auto'};
`;

export const OutLineContentContainer = styled(ContentContainer)`
  box-sizing: border-box;
  border: 16px solid #ffffff00;
`;
