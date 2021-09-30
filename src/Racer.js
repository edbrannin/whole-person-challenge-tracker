import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`;

const Bar = styled.div`
  position: relative;
  width: ${props => props.percent}%;
  overflow: visible;
  background-color: ${props => props.color || 'green'};
  transition-property: width, background-color;
  transition-duration: 0.5s, 0.5s;
`;

const Racer = ({ name, percent, color }) => (
  <Wrapper>
    <Bar percent={percent} color={color}>
      {name}
    </Bar>
  </Wrapper>
);

export default Racer;