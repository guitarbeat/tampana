import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import VueCalWrapper from './EventModal/../VueCalWrapper';
import EventModal from './EventModal';
import styled from 'styled-components';
import { EventData } from '../types/event-data';
import { postEventChange } from '../services/n8nClient';

const CalendarContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const CalendarWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

interface EmotionalCalendarProps {
  onEventsUpdate?: (events: EventData[]) => void;
  currentView?: 'day' | 'week' | 'month';
  showWeekends?: boolean;
  timeFormat?: '12h' | '24h';
  defaultEventDurationMinutes?: number;
}

export interface EmotionalCalendarHandle {
  handleViewChange: (view: 'day' | 'week' | 'month') => void;
  handleTodayClick: () => void;
  handleAddEvent: () => void;
  handleEditMode: () => void;
  handleClearEvents: () => void;
}

const EmotionalCalendar = forwardRef<EmotionalCalendarHandle, EmotionalCalendarProps>(({ 
  onEventsUpdate,
  currentView: externalCurrentView = 'day',
  showWeekends: externalShowWeekends = true,
  timeFormat: externalTimeFormat = '24h',
  defaultEventDurationMinutes = 60
}, ref) => {
  const [events, setEvents] = useState<EventData[]>(() => {
    const storedEvents = localStorage.getItem("tampanaEvents");
    if (storedEvents) {
      // Parse stored events and convert date strings back to Date objects
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      return parsedEvents;
    }

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

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tampanaEvents", JSON.stringify(events));
  }, [events]);

  // Calendar settings state - use external props
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>(externalCurrentView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showWeekends, setShowWeekends] = useState(externalShowWeekends);
  const [showCurrentTime] = useState(true);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(externalTimeFormat);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [modalInitialTime, setModalInitialTime] = useState<{ start: Date; end: Date } | undefined>();

  const calendarRef = useRef<HTMLElement | null>(null);

  // Update internal state when external props change
  useEffect(() => {
    setCurrentView(externalCurrentView);
  }, [externalCurrentView]);

  useEffect(() => {
    setShowWeekends(externalShowWeekends);
  }, [externalShowWeekends]);

  useEffect(() => {
    setTimeFormat(externalTimeFormat);
  }, [externalTimeFormat]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    handleViewChange: (view: 'day' | 'week' | 'month') => {
      setCurrentView(view);
    },
    handleTodayClick: () => {
      setCurrentDate(new Date());
    },
    handleAddEvent: () => {
      const start = new Date();
      const end = new Date(start.getTime() + defaultEventDurationMinutes * 60 * 1000);
      setModalInitialTime({ start, end });
      setSelectedEvent(null);
      setIsModalOpen(true);
    },
    handleEditMode: () => {
      // Toggle edit mode or show edit instructions
      console.log('Edit mode toggled');
    },
    handleClearEvents: () => {
      if (window.confirm('Are you sure you want to clear all events?')) {
        setEvents([]);
        localStorage.removeItem('tampanaEvents');
      }
    }
  }));

  const handleEventCreate = useCallback((event: EventData) => {
    const start = event.start;
    const end = new Date(start.getTime() + defaultEventDurationMinutes * 60 * 1000);
    setModalInitialTime({ start, end });
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, [defaultEventDurationMinutes]);

  const handleEventSave = useCallback((eventData: Partial<EventData>) => {
    if (eventData.id) {
      // Update existing event
      setEvents(prev => {
        const updatedEvents = prev.map(event => 
          event.id === eventData.id ? { ...event, ...eventData } as EventData : event
        );
        onEventsUpdate?.(updatedEvents);
        const updated = updatedEvents.find(e => e.id === eventData.id);
        if (updated) {
          // Fire and forget; client handles queuing
          postEventChange({
            ...updated,
            start: updated.start.toISOString(),
            end: updated.end.toISOString(),
          }, 'updated');
        }
        return updatedEvents;
      });
    } else {
      // Create new event
      const newEvent: EventData = {
        id: Date.now().toString(),
        title: eventData.title || 'New Event',
        start: eventData.start!,
        end: eventData.end!,
        emotion: eventData.emotion || 'neutral',
        emoji: eventData.emoji || '😐',
        class: eventData.class || 'emotional-event neutral',
        background: false,
        allDay: false
      };
      
      setEvents(prev => {
        const updatedEvents = [...prev, newEvent];
        onEventsUpdate?.(updatedEvents);
        postEventChange({
          ...newEvent,
          start: newEvent.start.toISOString(),
          end: newEvent.end.toISOString(),
        }, 'created');
        return updatedEvents;
      });
    }
  }, [onEventsUpdate]);

  const handleEventDelete = useCallback((eventId: string) => {
    setEvents(prev => {
      const updatedEvents = prev.filter(event => event.id !== eventId);
      onEventsUpdate?.(updatedEvents);
      // Send minimal payload for delete
      postEventChange({ id: eventId }, 'deleted');
      return updatedEvents;
    });
  }, [onEventsUpdate]);

  // Call onEventsUpdate when component mounts with initial events
  useEffect(() => {
    onEventsUpdate?.(events);
  }, []);

  // Call onEventsUpdate whenever events change
  useEffect(() => {
    onEventsUpdate?.(events);
  }, [events, onEventsUpdate]);

  const handleViewChange = useCallback((view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  }, []);

  const handleEventClick = useCallback((event: EventData) => {
    setSelectedEvent(event);
    setModalInitialTime(undefined);
    setIsModalOpen(true);
  }, []);

  return (
    <CalendarContainer>
      <CalendarWrapper>
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
          view={currentView}
          style={{
            height: '100%', 
            width: '100%'
          }}
          theme="dark"
          hideViewSelector={true}
          hideTitleBar={true}
          timeCellHeight={40}
          timeStep={30}
          timeFormat={timeFormat}
          showAllDayEvents={false}
          showTimeInCells={true}
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
          eventHeight={32}
          eventMargin={2}
          eventBorderRadius={8}
          eventPadding="8px 12px"
          eventFontSize="0.85em"
          eventFontWeight={500}
          eventLetterSpacing="0.3px"
          eventBoxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
          eventTransition="all 0.2s ease"
          todayButton={false}
          clickToNavigate={false}
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
              gap: '8px'
            }}>
              <span className="title" style={{
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 500
              }}>{event.title}</span>
              <span className="emoji" style={{
                fontSize: '1.2em',
                flexShrink: 0
              }}>{event.emoji}</span>
            </div>
          )}
        />
      </CalendarWrapper>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        event={selectedEvent}
        initialDate={currentDate}
        initialTime={modalInitialTime}
      />
    </CalendarContainer>
  );
});

export default EmotionalCalendar; 