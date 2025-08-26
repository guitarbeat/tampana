import { useState, useRef, lazy, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import VerticalSplit from './components/VerticalSplit/VerticalSplit';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  CalendarIcon,
  HomeIcon,
  SunIcon,
  MoonIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentTextIcon,
} from './icons';
const EmotionalCalendar = lazy(() => import('./components/EmotionalCalendar'));
const EmojiGridMapper = lazy(() => import('./components/EmojiGridMapper/EmojiGridMapper'));
const DataExport = lazy(() => import('./components/DataExport'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { EventData } from './types/event-data';
import { EmotionLog } from './types/emotion-log';
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
    overflow: visible;
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
  overflow: visible;
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
  overflow: visible;
`;

function ThemedApp() {
  const { theme, themeName, toggleTheme } = useTheme();
  const [events, setEvents] = useState<EventData[]>([]);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tampanaCurrentView');
      if (saved === 'day' || saved === 'week' || saved === 'month') return saved;
      try {
        const settings = JSON.parse(localStorage.getItem('tampanaSettings') || '{}');
        if (settings.defaultView === 'day' || settings.defaultView === 'week' || settings.defaultView === 'month') {
          return settings.defaultView;
        }
      } catch (e) { /* ignore invalid JSON */ }
    }
    return 'week';
  });
  const [, setCurrentDate] = useState(new Date()); // used to force-update date when clicking Today
  const [showWeekends, setShowWeekends] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tampanaShowWeekends');
      if (saved === 'true' || saved === 'false') return saved === 'true';
    }
    return true;
  });
  const [timeFormat24h, setTimeFormat24h] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tampanaTimeFormat24h');
      if (saved === 'true' || saved === 'false') return saved === 'true';
    }
    return false;
  });
  const [showSettings, setShowSettings] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tampanaShowSettings');
      if (saved === 'true' || saved === 'false') return saved === 'true';
    }
    return false;
  });
  const [defaultEventDuration, setDefaultEventDuration] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const settings = JSON.parse(localStorage.getItem('tampanaSettings') || '{}');
        if (typeof settings.eventDuration === 'number') return settings.eventDuration;
      } catch (e) { /* ignore invalid JSON */ }
    }
    return 60;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const settings = JSON.parse(localStorage.getItem('tampanaSettings') || '{}');
        if (typeof settings.notifications === 'boolean') return settings.notifications;
      } catch (e) { /* ignore invalid JSON */ }
    }
    return true;
  });
  
  const calendarRef = useRef<EmotionalCalendarHandle | null>(null);
  const dataExportRef = useRef<DataExportHandle | null>(null);
  const logBufferRef = useRef<EmotionLog[]>([]);
  const [, setEmotionLogs] = useState<EmotionLog[]>([]);

  // Periodically flush buffered logs to state to limit re-renders
  useEffect(() => {
    const id = setInterval(() => {
      if (logBufferRef.current.length) {
        setEmotionLogs(prev => {
          const next = [...prev, ...logBufferRef.current];
          logBufferRef.current = [];
          return next.slice(-100); // keep only last 100 logs
        });
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { localStorage.setItem('tampanaCurrentView', currentView); }, [currentView]);
  useEffect(() => { localStorage.setItem('tampanaShowWeekends', String(showWeekends)); }, [showWeekends]);
  useEffect(() => { localStorage.setItem('tampanaTimeFormat24h', String(timeFormat24h)); }, [timeFormat24h]);
  useEffect(() => { localStorage.setItem('tampanaShowSettings', String(showSettings)); }, [showSettings]);
  useEffect(() => {
    const prev = (() => { try { return JSON.parse(localStorage.getItem('tampanaSettings') || '{}'); } catch { return {}; }})();
    const next = { ...prev, eventDuration: defaultEventDuration };
    localStorage.setItem('tampanaSettings', JSON.stringify(next));
  }, [defaultEventDuration]);
  useEffect(() => {
    const prev = (() => { try { return JSON.parse(localStorage.getItem('tampanaSettings') || '{}'); } catch { return {}; }})();
    const next = { ...prev, notifications: notificationsEnabled };
    localStorage.setItem('tampanaSettings', JSON.stringify(next));
  }, [notificationsEnabled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      switch (e.key.toLowerCase()) {
        case '1': setCurrentView('day'); calendarRef.current?.handleViewChange('day'); break;
        case '2': setCurrentView('week'); calendarRef.current?.handleViewChange('week'); break;
        case '3': setCurrentView('month'); calendarRef.current?.handleViewChange('month'); break;
        case 't': {
          const today = new Date();
          setCurrentDate(today);
          calendarRef.current?.handleTodayClick();
          break;
        }
        case 'e': dataExportRef.current?.handleExport(); break;
        case 'w': setShowWeekends(prev => !prev); break;
        case 'f': setTimeFormat24h(prev => !prev); break;
        case 's': setShowSettings(prev => !prev); break;
        default: break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleEventsUpdate = (updatedEvents: EventData[]) => {
    setEvents(updatedEvents);
  };

  const handleEmojiSelect = (log: EmotionLog) => {
    logBufferRef.current.push(log);
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

  const handleEmojiSelect = useCallback((data: EmotionLog) => {
    console.log('Emoji selected', data);
  }, []);

  const leadingAccessories = [
    {
      icon: <CalendarDaysIcon />,
      tooltip: 'Day View (1)',
      onClick: () => handleViewChange('day'),
      isActive: currentView === 'day',
      color: currentView === 'day' ? '#4CAF50' : '#666'
    },
    {
      icon: <ChartBarIcon />,
      tooltip: 'Week View (2)',
      onClick: () => handleViewChange('week'),
      isActive: currentView === 'week',
      color: currentView === 'week' ? '#2196F3' : '#666'
    },
    {
      icon: <CalendarIcon />,
      tooltip: 'Month View (3)',
      onClick: () => handleViewChange('month'),
      isActive: currentView === 'month',
      color: currentView === 'month' ? '#9C27B0' : '#666'
    },
    {
      icon: <HomeIcon />,
      tooltip: 'Today (T)',
      onClick: handleTodayClick,
      isActive: false,
      color: '#FFD700'
    }
  ];

  const trailingAccessories = [
    {
      icon: themeName === 'dark' ? <SunIcon /> : <MoonIcon />,
      tooltip: themeName === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode',
      onClick: toggleTheme,
      isActive: false,
      color: themeName === 'dark' ? '#FFD700' : '#4169E1'
    },
    {
      icon: <ArrowUpTrayIcon />,
      tooltip: 'Export Data (E)',
      onClick: handleExportData,
      isActive: false,
      color: '#FF9800'
    },
    {
      icon: showWeekends ? <CalendarDaysIcon /> : <CalendarIcon />,
      tooltip: showWeekends ? 'Hide Weekends (W)' : 'Show Weekends (W)',
      onClick: toggleWeekends,
      isActive: showWeekends,
      color: showWeekends ? '#4CAF50' : '#666'
    },
    {
      icon: <ClockIcon />,
      tooltip: timeFormat24h ? '12h Format (F)' : '24h Format (F)',
      onClick: toggleTimeFormat,
      isActive: timeFormat24h,
      color: timeFormat24h ? '#2196F3' : '#666'
    },
    {
      icon: <Cog6ToothIcon />,
      tooltip: 'Settings (S)',
      onClick: handleSettingsClick,
      isActive: showSettings,
      color: showSettings ? '#FF5722' : '#666'
    }
  ];

  const menuAccessories = [
    { label: 'Add New Event', icon: <PlusIcon />, onClick: handleAddEvent },
    { label: 'Edit Mode', icon: <PencilSquareIcon />, onClick: handleEditMode },
    { label: 'Clear All Events', icon: <TrashIcon />, onClick: handleClearEvents },
    { label: 'Export as JSON', icon: <DocumentTextIcon />, onClick: handleExportJSON },
    { label: 'Export as CSV', icon: <ChartBarIcon />, onClick: handleExportCSV }
  ];
  ];

  return (
    <AppContainer theme={theme}>
      <GlobalStyle />
      <VerticalSplit
        leadingAccessories={leadingAccessories}
        trailingAccessories={trailingAccessories}
        menuAccessories={menuAccessories}
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
              eventDuration={defaultEventDuration}
              onChangeEventDuration={setDefaultEventDuration}
              notifications={notificationsEnabled}
              onChangeNotifications={setNotificationsEnabled}
            />
          ) : (
            <EmotionalCalendar
              ref={calendarRef}
              currentView={currentView}
              showWeekends={showWeekends}
              timeFormat={timeFormat24h ? '24h' : '12h'}
              onEventsUpdate={handleEventsUpdate}
              defaultEventDurationMinutes={defaultEventDuration}
            />
          )}
        </Panel>
        <Panel>
          <EmojiGridMapper onEmojiSelect={handleEmojiSelect} />
        </Panel>
      </VerticalSplit>
      <DataExport ref={dataExportRef} events={events} enableToasts={notificationsEnabled} />
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

