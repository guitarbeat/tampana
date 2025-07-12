import React, { useState, useCallback, useRef } from 'react';
import VueCalWrapper from './VueCalWrapper';
import styled from 'styled-components';
import { EventData } from '../types/event-data';

const CalendarContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #fff;
  position: relative;
`;





const EmotionalCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(() => {
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

  const [showWeekends] = useState(true);

  const [currentView] = useState<'day' | 'week' | 'month'>('day');
  const calendarRef = useRef<HTMLElement | null>(null);

  const [showAllDayEvents] = useState(false);
  const [showCurrentTime] = useState(true);
  const [timeFormat] = useState<'12h' | '24h'>('24h');
  const [showEventTimes] = useState(true);

  const handleEventCreate = useCallback((event: EventData) => {
    const newEvent: EventData = {
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
    // Handle view changes - currently just logging for debugging
    console.log('View changed to:', view);
  }, []);

  const handleEventClick = useCallback((event: EventData) => {
    // Add tagged class for animation
    const eventElement = document.querySelector(`[data-event-id="${event.id}"]`);
    if (eventElement) {
      eventElement.classList.add('tagged');
      setTimeout(() => {
        eventElement.classList.remove('tagged');
      }, 300);
    }
  }, []);









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
        eventContent={({ event }: { event: EventData }) => (
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