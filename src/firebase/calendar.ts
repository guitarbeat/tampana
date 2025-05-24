import { useState } from 'react';

// Interface for calendar events from Google Calendar API
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  htmlLink: string;
}

// Hook for fetching calendar events
export const useGoogleCalendar = (accessToken: string | null) => {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch calendar events
  const fetchCalendarEvents = async (startDate?: Date, endDate?: Date) => {
    if (!accessToken) {
      setError('No access token available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set default date range to current week if not provided
      const now = new Date();
      const start = startDate || new Date(now.setHours(0, 0, 0, 0));
      const end = endDate || new Date(now.setDate(now.getDate() + 7));

      // Format dates for API
      const timeMin = start.toISOString();
      const timeMax = end.toISOString();

      // Fetch events from Google Calendar API
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  };

  // Convert Google Calendar events to app format
  const convertToAppEvents = () => {
    return events.map(event => ({
      id: event.id,
      title: event.summary,
      startTime: new Date(event.start.dateTime),
      endTime: new Date(event.end.dateTime),
      description: event.description,
      location: event.location,
      htmlLink: event.htmlLink,
      // Initialize with neutral emotional value
      emotionalValue: {
        valence: 0,
        arousal: 0.5
      }
    }));
  };

  return {
    events,
    loading,
    error,
    fetchCalendarEvents,
    convertToAppEvents
  };
};
