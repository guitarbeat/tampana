import { useState, useRef, lazy } from 'react';
import styled from 'styled-components';
import VerticalSplit from './components/VerticalSplit/VerticalSplit';
const EmotionalCalendar = lazy(() => import('./components/EmotionalCalendar'));
const EmojiGridMapper = lazy(() => import('./components/EmojiGridMapper/EmojiGridMapper'));
const DataExport = lazy(() => import('./components/DataExport'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { EventData } from './types/event-data';
import './index.css';
import './styles/emotional-calendar.css';

// Types for refs exposed by children
export interface EmotionalCalendarHandle {
  handleViewChange: (view: 'day' | 'week' | 'month') => void;
  handleTodayClick: () => void;
  handleAddEvent: () => void;
  handleEditMode: () => void;
  handleClearEvents: () => void;
}

export interface DataExportHandle {
  handleExport: () => void;
  handleExportJSON: () => void;
  handleExportCSV: () => void;
  handleExportSummary: () => void;
}

const GlobalStyle = styled.div`
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

const AppContainer = styled.div<{ theme: any }>`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: ${props => props.theme.background};
  width: 100vw;
  height: 100vh;
  color: ${props => props.theme.color};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Panel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function ThemedApp() {
  const { theme, themeName, toggleTheme } = useTheme();
  const [events, setEvents] = useState<EventData[]>([]);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [, setCurrentDate] = useState(new Date()); // used to force-update date when clicking Today
  const [showWeekends, setShowWeekends] = useState(true);
  const [timeFormat24h, setTimeFormat24h] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const calendarRef = useRef<EmotionalCalendarHandle | null>(null);
  const dataExportRef = useRef<DataExportHandle | null>(null);

  const handleEventsUpdate = (updatedEvents: EventData[]) => {
    setEvents(updatedEvents);
  };

  const toggleWeekends = () => {
    setShowWeekends(!showWeekends);
  };

  const toggleTimeFormat = () => {
    setTimeFormat24h(!timeFormat24h);
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
    calendarRef.current?.handleViewChange(view);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    calendarRef.current?.handleTodayClick();
  };

  const handleAddEvent = () => {
    calendarRef.current?.handleAddEvent();
  };

  const handleEditMode = () => {
    calendarRef.current?.handleEditMode();
  };

  const handleClearEvents = () => {
    calendarRef.current?.handleClearEvents();
  };

  const handleExportData = () => {
    dataExportRef.current?.handleExport();
  };

  const handleExportJSON = () => {
    dataExportRef.current?.handleExportJSON();
  };

  const handleExportCSV = () => {
    dataExportRef.current?.handleExportCSV();
  };

  const leadingAccessories = [
    {
      icon: '📅',
      tooltip: 'Day View',
      onClick: () => handleViewChange('day'),
      isActive: currentView === 'day',
      color: currentView === 'day' ? '#4CAF50' : '#666'
    },
    {
      icon: '📊',
      tooltip: 'Week View',
      onClick: () => handleViewChange('week'),
      isActive: currentView === 'week',
      color: currentView === 'week' ? '#2196F3' : '#666'
    },
    {
      icon: '📆',
      tooltip: 'Month View',
      onClick: () => handleViewChange('month'),
      isActive: currentView === 'month',
      color: currentView === 'month' ? '#9C27B0' : '#666'
    },
    {
      icon: '🏠',
      tooltip: 'Today',
      onClick: handleTodayClick,
      isActive: false,
      color: '#FFD700'
    }
  ];

  const trailingAccessories = [
    {
      icon: themeName === 'dark' ? '☀️' : '🌙',
      tooltip: themeName === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode',
      onClick: toggleTheme,
      isActive: false,
      color: themeName === 'dark' ? '#FFD700' : '#4169E1'
    },
    {
      icon: '📤',
      tooltip: 'Export Data',
      onClick: handleExportData,
      isActive: false,
      color: '#FF9800'
    },
    {
      icon: showWeekends ? '📅' : '🗓️',
      tooltip: showWeekends ? 'Hide Weekends' : 'Show Weekends',
      onClick: toggleWeekends,
      isActive: showWeekends,
      color: showWeekends ? '#4CAF50' : '#666'
    },
    {
      icon: timeFormat24h ? '🕐' : '🕛',
      tooltip: timeFormat24h ? '12h Format' : '24h Format',
      onClick: toggleTimeFormat,
      isActive: timeFormat24h,
      color: timeFormat24h ? '#2196F3' : '#666'
    },
    {
      icon: '⚙️',
      tooltip: 'Settings',
      onClick: handleSettingsClick,
      isActive: showSettings,
      color: showSettings ? '#FF5722' : '#666'
    }
  ];

  const menuItems = [
    { label: 'Add New Event', icon: '➕', onClick: handleAddEvent },
    { label: 'Edit Mode', icon: '✏️', onClick: handleEditMode },
    { label: 'Clear All Events', icon: '🗑️', onClick: handleClearEvents },
    { label: 'Export as JSON', icon: '📄', onClick: handleExportJSON },
    { label: 'Export as CSV', icon: '📊', onClick: handleExportCSV }
  ];

  return (
    <AppContainer theme={theme}>
      <GlobalStyle />
      <VerticalSplit
        leadingAccessories={leadingAccessories}
        trailingAccessories={trailingAccessories}
        menuItems={menuItems}
      >
        <Panel>
          {showSettings ? (
            <SettingsPage
              showWeekends={showWeekends}
              toggleWeekends={toggleWeekends}
              timeFormat24h={timeFormat24h}
              toggleTimeFormat={toggleTimeFormat}
              themeName={themeName}
              toggleTheme={toggleTheme}
            />
          ) : (
            <EmotionalCalendar
              ref={calendarRef}
              currentView={currentView}
              showWeekends={showWeekends}
              timeFormat={timeFormat24h ? '24h' : '12h'}
              onEventsUpdate={handleEventsUpdate}
            />
          )}
        </Panel>
        <Panel>
          <EmojiGridMapper />
        </Panel>
      </VerticalSplit>
      <DataExport ref={dataExportRef} events={events} />
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;

