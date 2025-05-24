import VerticalSplit from './components/VerticalSplit/VerticalSplit';
import styled from 'styled-components';

// Styled components for the app
const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: #000;
  width: 100vw;
  height: 100vh;
  color: #fff;
`;

const Panel = styled.div`
  flex: 1 1 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
`;

const CenteredNumber = styled.div`
  font-size: 7rem;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <AppContainer>
      <VerticalSplit
        topView={
          <Panel>
            <CenteredNumber>1</CenteredNumber>
          </Panel>
        }
        bottomView={
          <Panel>
            <CenteredNumber>2</CenteredNumber>
          </Panel>
        }
        bgColor="#1a1a1a"
      />
    </AppContainer>
  );
}

export default App;
