import VerticalSplit from './components/VerticalSplit/VerticalSplit';
import EmojiGridMapper from './components/EmojiGridMapper';
import EmotionalCalendar from './components/EmotionalCalendar';
import DataExport from './components/DataExport';
import styled, { createGlobalStyle } from 'styled-components';
import { useState, useRef } from 'react';
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
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  const [showWeekends, setShowWeekends] = useState(true);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  const calendarRef = useRef<any>(null);
  const dataExportRef = useRef<any>(null);

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

  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
    // Pass view change to calendar if ref exists
    if (calendarRef.current && calendarRef.current.handleViewChange) {
      calendarRef.current.handleViewChange(view);
    }
  };

  const handleTodayClick = () => {
    if (calendarRef.current && calendarRef.current.handleTodayClick) {
      calendarRef.current.handleTodayClick();
    }
  };

  const handleExportData = () => {
    if (dataExportRef.current && dataExportRef.current.handleExport) {
      dataExportRef.current.handleExport();
    }
  };

  const handleToggleWeekends = () => {
    setShowWeekends(!showWeekends);
  };

  const handleToggleTimeFormat = () => {
    setTimeFormat(timeFormat === '12h' ? '24h' : '12h');
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <DataExport ref={dataExportRef} events={events} />
        <VerticalSplit
          topView={
            <Panel>
              <EmotionalCalendar 
                ref={calendarRef}
                onEventsUpdate={handleEventsUpdate}
                currentView={currentView}
                showWeekends={showWeekends}
                timeFormat={timeFormat}
              />
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
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                </svg>
              ),
              onClick: () => handleViewChange('day'),
              color: currentView === 'day' ? '#4ECDC4' : '#FFFFFF'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 3h-6l-2-2H8L6 3H0v2h2v16h20V5h2V3zM4 19V5h16v14H4z" />
                </svg>
              ),
              onClick: () => handleViewChange('week'),
              color: currentView === 'week' ? '#4ECDC4' : '#FFFFFF'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              ),
              onClick: () => handleViewChange('month'),
              color: currentView === 'month' ? '#4ECDC4' : '#FFFFFF'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ),
              onClick: handleTodayClick,
              color: '#FFD700'
            }
          ]}
          trailingAccessories={[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                </svg>
              ),
              onClick: handleExportData,
              color: '#4ECDC4'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              ),
              onClick: handleToggleWeekends,
              color: showWeekends ? '#4ECDC4' : '#666666'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              ),
              onClick: handleToggleTimeFormat,
              color: timeFormat === '24h' ? '#4ECDC4' : '#FFD700'
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
              onClick: () => {
                if (calendarRef.current && calendarRef.current.handleAddEvent) {
                  calendarRef.current.handleAddEvent();
                }
              },
              color: '#4ECDC4'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              ),
              label: 'Edit Mode',
              onClick: () => {
                if (calendarRef.current && calendarRef.current.handleEditMode) {
                  calendarRef.current.handleEditMode();
                }
              },
              color: '#FFD700'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              ),
              label: 'Clear All Events',
              onClick: () => {
                if (calendarRef.current && calendarRef.current.handleClearEvents) {
                  calendarRef.current.handleClearEvents();
                }
              },
              color: '#FF6B6B'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ),
              label: 'Export as JSON',
              onClick: () => {
                if (dataExportRef.current && dataExportRef.current.handleExportJSON) {
                  dataExportRef.current.handleExportJSON();
                }
              },
              color: '#4ECDC4'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                </svg>
              ),
              label: 'Export as CSV',
              onClick: () => {
                if (dataExportRef.current && dataExportRef.current.handleExportCSV) {
                  dataExportRef.current.handleExportCSV();
                }
              },
              color: '#4ECDC4'
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
