import React, { useState, useCallback, useRef } from 'react';
import VueCalWrapper from './VueCalWrapper';
import styled from 'styled-components';

interface EmotionalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  emotion: string;
  emoji: string;
  class?: string;
  background?: boolean;
  split?: number;
  allDay?: boolean;
}

const CalendarContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #fff;
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1000;
`;

const AccessoryButton = styled.button<{ $active?: boolean }>`
  position: relative;
  &:hover ${Tooltip} {
    opacity: 1;
  }
`;

const EmotionalCalendar: React.FC = () => {
  const [events, setEvents] = useState<EmotionalEvent[]>(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return [
      {
        id: '1',
        title: 'Morning Meditation',
        start: new Date(today.setHours(8, 0, 0, 0)),
        end: new Date(today.setHours(9, 0, 0, 0)),
        emotion: 'calm',
        emoji: '😌',
        class: 'emotional-event calm',
        background: false,
        allDay: false
      },
      {
        id: '2',
        title: 'Team Meeting',
        start: new Date(today.setHours(10, 30, 0, 0)),
        end: new Date(today.setHours(11, 30, 0, 0)),
        emotion: 'happy',
        emoji: '😊',
        class: 'emotional-event happy',
        background: false,
        allDay: false
      },
      {
        id: '3',
        title: 'Lunch Break',
        start: new Date(today.setHours(12, 0, 0, 0)),
        end: new Date(today.setHours(13, 0, 0, 0)),
        emotion: 'neutral',
        emoji: '😐',
        class: 'emotional-event neutral',
        background: false,
        allDay: false
      },
      {
        id: '4',
        title: 'Project Deadline',
        start: new Date(today.setHours(14, 0, 0, 0)),
        end: new Date(today.setHours(16, 0, 0, 0)),
        emotion: 'angry',
        emoji: '😤',
        class: 'emotional-event angry',
        background: false,
        allDay: false
      },
      {
        id: '5',
        title: 'Evening Walk',
        start: new Date(today.setHours(17, 0, 0, 0)),
        end: new Date(today.setHours(18, 0, 0, 0)),
        emotion: 'sad',
        emoji: '😔',
        class: 'emotional-event sad',
        background: false,
        allDay: false
      }
    ];
  });

  const [showWeekends, setShowWeekends] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EmotionalEvent | null>(null);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  const calendarRef = useRef<any>(null);

  const [showAllDayEvents, setShowAllDayEvents] = useState(false);
  const [showCurrentTime, setShowCurrentTime] = useState(true);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  const [showEventTimes, setShowEventTimes] = useState(true);

  const handleEventCreate = useCallback((event: any) => {
    const newEvent: EmotionalEvent = {
      id: Date.now().toString(),
      start: event.start,
      end: event.end,
      title: event.title || 'New Event',
      emotion: 'neutral',
      emoji: '😐',
      class: 'emotional-event neutral',
      background: false,
      allDay: false
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const handleViewChange = useCallback((view: any) => {
    // TODO: Add any view change handling logic here
  }, []);

  const handleEventClick = useCallback((event: any) => {
    setSelectedEvent(event);
    // Add tagged class for animation
    const eventElement = document.querySelector(`[data-event-id="${event.id}"]`);
    if (eventElement) {
      eventElement.classList.add('tagged');
      setTimeout(() => {
        eventElement.classList.remove('tagged');
      }, 300);
    }
  }, []);

  const handleEmojiSelect = useCallback((emoji: any) => {
    if (selectedEvent) {
      setEvents(prev => prev.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            emotion: emoji.emotion,
            emoji: emoji.emoji,
            class: `emotional-event ${emoji.emotion}`
          };
        }
        return event;
      }));
      setSelectedEvent(null);
    }
  }, [selectedEvent]);

  const toggleWeekends = useCallback(() => {
    setShowWeekends(prev => !prev);
  }, []);

  const changeView = useCallback((view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  }, []);

  const leadingAccessories = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      ),
      onClick: () => changeView('day'),
      color: currentView === 'day' ? '#4ECDC4' : '#fff',
      tooltip: 'Day View'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
        </svg>
      ),
      onClick: () => changeView('week'),
      color: currentView === 'week' ? '#4ECDC4' : '#fff',
      tooltip: 'Week View'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
        </svg>
      ),
      onClick: () => changeView('month'),
      color: currentView === 'month' ? '#4ECDC4' : '#fff',
      tooltip: 'Month View'
    }
  ];

  const trailingAccessories = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      onClick: toggleWeekends,
      color: showWeekends ? '#4ECDC4' : '#fff',
      tooltip: showWeekends ? 'Hide Weekends' : 'Show Weekends'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      ),
      onClick: () => setTimeFormat(prev => prev === '12h' ? '24h' : '12h'),
      color: timeFormat === '24h' ? '#4ECDC4' : '#fff',
      tooltip: timeFormat === '24h' ? 'Switch to 12h' : 'Switch to 24h'
    }
  ];

  const menuAccessories = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      label: 'Show All Day Events',
      onClick: () => setShowAllDayEvents(prev => !prev),
      color: showAllDayEvents ? '#4ECDC4' : '#fff'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      ),
      label: 'Show Current Time',
      onClick: () => setShowCurrentTime(prev => !prev),
      color: showCurrentTime ? '#4ECDC4' : '#fff'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      ),
      label: 'Show Event Times',
      onClick: () => setShowEventTimes(prev => !prev),
      color: showEventTimes ? '#4ECDC4' : '#fff'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      label: 'Show Event Emojis',
      onClick: () => {/* Toggle event emojis */},
      color: '#4ECDC4'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      label: 'Show Event Colors',
      onClick: () => {/* Toggle event colors */},
      color: '#4ECDC4'
    }
  ];

  return (
    <CalendarContainer>
      <VueCalWrapper
        ref={calendarRef}
        events={events}
        onEventCreate={handleEventCreate}
        onViewChange={handleViewChange}
        onEventClick={handleEventClick}
        editableEvents={true}
        hideWeekends={!showWeekends}
        timeFrom={6 * 60}
        timeTo={22 * 60}
        viewsBar={false}
        virtualScroll={false}
        disableViewTransitions={false}
        cellHeight={40}
        cellWidth={120}
        eventOverlap={true}
        eventCellClass="emotional-event"
        defaultView={currentView}
        style={{ 
          height: '100%', 
          width: '100%'
        }}
        theme="dark"
        hideViewSelector={true}
        hideTitleBar={false}
        timeCellHeight={40}
        timeStep={30}
        timeFormat={timeFormat}
        showAllDayEvents={showAllDayEvents}
        showTimeInCells={showEventTimes}
        showCurrentTime={showCurrentTime}
        showCurrentTimeLine={showCurrentTime}
        currentTimeLineColor="#FF6B6B"
        currentTimeLineStyle="solid"
        currentTimeLineWidth={2}
        currentTimeLineOpacity={0.8}
        currentTimeLineOffset={0}
        currentTimeLineZIndex={10}
        currentTimeLineAnimation={true}
        currentTimeLineAnimationDuration={2000}
        currentTimeLineAnimationInterval={60000}
        snapToTime={15}
        minEventWidth={80}
        eventHeight={28}
        eventMargin={2}
        eventBorderRadius={8}
        eventPadding="6px 8px"
        eventFontSize="0.85em"
        eventFontWeight={500}
        eventLetterSpacing="0.3px"
        eventBoxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
        eventTransition="all 0.2s ease"
        todayButton={false}
        clickToNavigate={true}
        dblclickToNavigate={false}
        dragToCreateEvent={true}
        dragToCreateThreshold={15}
        resizeX={false}
        resizeY={true}
        eventContent={({ event }: { event: EmotionalEvent }) => (
          <div className="event-content" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            gap: '6px'
          }}>
            <span className="title" style={{
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 500
            }}>{event.title}</span>
            <span className="emoji" style={{
              fontSize: '1.1em',
              flexShrink: 0
            }}>{event.emoji}</span>
          </div>
        )}
      />
    </CalendarContainer>
  );
};

export default EmotionalCalendar; 