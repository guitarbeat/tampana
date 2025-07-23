import VerticalSplit from './components/VerticalSplit/VerticalSplit';
import EmojiGridMapper from './components/EmojiGridMapper';
import EmotionalCalendar from './components/EmotionalCalendar';
import DataExport from './components/DataExport';
import styled, { createGlobalStyle } from 'styled-components';
import { useState } from 'react';
import './index.css';
import './styles/emotional-calendar.css';

const GlobalStyle = createGlobalStyle`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  html, body, #root {
    height: 100%;
    margin: 0;
    overflow: hidden;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #000;
    color: #fff;
  }
`;

const AppContainer = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000;
  width: 100vw;
  height: 100vh;
  color: #fff;
`;

const Panel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  height: 100%;
  width: 100%;
`;



const EmojiContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

function App() {
  const [events, setEvents] = useState<any[]>([]);

  const handleEmojiSelect = (_emoji: any) => {
    // You can add your emoji handling logic here
    // Example: setCurrentEmotion(emoji.emotion);
  };

  const handleGridChange = (_grid: any) => {
    // You can add your grid change handling logic here
    // Example: saveGridState(grid);
  };

  const handleEventsUpdate = (newEvents: any[]) => {
    setEvents(newEvents);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <DataExport events={events} />
        <VerticalSplit
          topView={
            <Panel>
              <EmotionalCalendar onEventsUpdate={handleEventsUpdate} />
            </Panel>
          }
          bottomView={
            <EmojiContainer>
              <EmojiGridMapper 
                onEmojiSelect={handleEmojiSelect} 
                onGridChange={handleGridChange}
              />
            </EmojiContainer>
          }
          bgColor="#1a1a1a"
          leadingAccessories={[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
              onClick: () => {/* Handle star click */},
              color: '#FFD700'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ),
              onClick: () => {/* Handle heart click */},
              color: '#FF6B6B'
            }
          ]}
          trailingAccessories={[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ),
              onClick: () => {/* Handle check click */},
              color: '#4ECDC4'
            }
          ]}
          menuAccessories={[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              ),
              label: 'Add New Event',
              onClick: () => {/* Handle add new event */},
              color: '#4ECDC4'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                </svg>
              ),
              label: 'Remove Event',
              onClick: () => {/* Handle remove event */},
              color: '#FF6B6B'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
              label: 'Mark as Favorite',
              onClick: () => {/* Handle mark as favorite */},
              color: '#FFD700'
            }
          ]}
          menuIcon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          }
          menuColor="#FFFFFF"
        />
      </AppContainer>
    </>
  );
}

export default App;
