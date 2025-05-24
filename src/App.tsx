import { useState } from 'react';
import VerticalSplit from './components/VerticalSplit/VerticalSplit';
import { SplitDetent } from './components/VerticalSplit/SplitDetent';
import styled from 'styled-components';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Styled components for the app
const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #000;
  width: 100vw;
  height: 100vh;
  color: #fff;
`;

const Panel = styled.div`
  height: 100%;
  background-color: #1a1a1a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CenteredNumber = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7rem;
  color: #fff;
  font-weight: bold;
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
        initialDetent={SplitDetent.FRACTION_3_6}
        bgColor="#1a1a1a"
        leadingAccessories={[
          { id: 'profile', icon: <PersonIcon />, action: () => console.log('Profile clicked') },
          { id: 'search', icon: <SearchIcon />, action: () => console.log('Search clicked') }
        ]}
        trailingAccessories={[
          { id: 'messages', icon: <ChatIcon />, action: () => console.log('Messages clicked') },
          { id: 'add', icon: <AddCircleIcon />, action: () => console.log('Add clicked') }
        ]}
      />
    </AppContainer>
  );
}

export default App;
