import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Color = '#000000' | '#FFFFFF' | '#010440' | 'transparent' | 'white';
type Props = {
  color?: Color;
  backgroundColor?: Color;
};

const StyledIcon = styled(MaterialIcons)<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  backgroundcolor: ${props =>
    props.backgroundColor ? props.backgroundColor : 'transparent'};
`;

function Icon({size = 24, ...props}) {
  return <StyledIcon size={size} {...props} />;
}
export default Icon;
