# Vue Cal Integration Guide for Emotional State Tagging

## Overview

This guide explains how to integrate Vue Cal with emotional state tagging in our React application. We'll use Veaury to bridge Vue Cal into our React environment.

## Current Setup

Our application currently has:
- React with TypeScript
- Vue Cal v5.0.1-rc.25 installed
- An existing `EmojiGridMapper` component for emotion selection
- A vertical split layout for UI organization

## Important Vue Cal v5.0.0 Changes

Before proceeding with the integration, note these important changes in Vue Cal v5.0.0:

1. **Vue 3 Support**:
   - Vue Cal v5 is built for Vue 3
   - Requires Vue 3.4.0 or higher
   - Uses Vue 3's Composition API

2. **Package Structure**:
   - Main package: `vue-cal`
   - CSS imports: `vue-cal/style` (not `vue-cal/dist/vuecal.css`)
   - TypeScript support is built-in

3. **New Features**:
   - Improved performance with virtual scrolling
   - Better TypeScript support
   - Enhanced event handling
   - Improved accessibility

## Integration Steps

### 1. Install Required Dependencies

```bash
npm install veaury vue-cal@5
```

### 2. Create Vue Cal Wrapper Component

```typescript
// src/components/VueCalWrapper.tsx
import { applyVueInReact } from 'veaury';
import { VueCal, addDatePrototypes, stringToDate, countDays } from 'vue-cal';
import 'vue-cal/style';

// Add date prototypes for easier date manipulation
addDatePrototypes();

const VueCalWrapper = applyVueInReact(VueCal);

export default VueCalWrapper;
```

### 3. Create Emotional Calendar Component

```typescript
// src/components/EmotionalCalendar.tsx
import React, { useState, useCallback } from 'react';
import VueCalWrapper from './VueCalWrapper';
import EmojiGridMapper from './EmojiGridMapper';
import styled from 'styled-components';

interface EmotionalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  emotion: string;
  emoji: string;
  // New v5.0.0 properties
  class?: string;
  background?: boolean;
  split?: number;
  allDay?: boolean;
}

const CalendarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EmotionalCalendar: React.FC = () => {
  const [events, setEvents] = useState<EmotionalEvent[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showWeekends, setShowWeekends] = useState(true);

  const handleEmojiSelect = useCallback((emoji: any) => {
    setSelectedEmotion(emoji.emotion);
  }, []);

  const handleEventCreate = useCallback((event: any) => {
    if (selectedEmotion) {
      const newEvent: EmotionalEvent = {
        id: Date.now().toString(),
        start: event.start,
        end: event.end,
        title: event.title,
        emotion: selectedEmotion,
        emoji: selectedEmotion.emoji,
        // New v5.0.0 properties
        class: `emotional-event ${selectedEmotion}`,
        background: false,
        allDay: false
      };
      setEvents(prev => [...prev, newEvent]);
    }
  }, [selectedEmotion]);

  const handleViewChange = useCallback((view: any) => {
    // Fetch events for the new view range
    console.log('View changed:', view.start, view.end);
  }, []);

  const handleReady = useCallback(({ view }: any) => {
    // Initialize with some events
    const initialEvent: EmotionalEvent = {
      id: '1',
      title: 'Select an emotion to create events',
      start: new Date(view.start.addDays(3).setHours(10, 0, 0, 0)),
      end: new Date(view.start.addDays(3).setHours(14, 0, 0, 0)),
      emotion: 'neutral',
      emoji: '😐',
      class: 'emotional-event neutral',
      background: false,
      allDay: false
    };
    setEvents([initialEvent]);
  }, []);

  return (
    <CalendarContainer>
      <VueCalWrapper
        events={events}
        onEventCreate={handleEventCreate}
        onViewChange={handleViewChange}
        onReady={handleReady}
        editableEvents={true}
        hideWeekends={!showWeekends}
        timeFrom={8 * 60}
        timeTo={19 * 60}
        viewsBar={false}
        // New v5.0.0 props
        virtualScroll={true}
        disableViewTransitions={false}
        cellHeight={30}
        cellWidth={100}
        eventOverlap={false}
        eventCellClass="emotional-event"
      />
      <EmojiGridMapper onEmojiSelect={handleEmojiSelect} />
    </CalendarContainer>
  );
};

export default EmotionalCalendar;
```

### 4. Add Styling

```css
/* src/styles/emotional-calendar.css */
.vuecal {
  height: 100%;
  background: #fff;
  /* New v5.0.0 styles */
  --vuecal-event-bg-color: transparent;
  --vuecal-event-border-color: transparent;
  --vuecal-event-text-color: #000;
  --vuecal-event-height: 24px;
  --vuecal-event-margin: 1px;
}

.emotional-event {
  border-radius: 4px;
  padding: 4px;
  margin: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.emotional-event:hover {
  transform: scale(1.02);
}

.emotional-event .emoji {
  font-size: 1.2em;
}

/* Emotion-specific styles */
.emotional-event.happy { 
  background-color: #FFD700;
  border: 1px solid #FFC107;
}

.emotional-event.sad { 
  background-color: #87CEEB;
  border: 1px solid #64B5F6;
}

.emotional-event.angry { 
  background-color: #FF6B6B;
  border: 1px solid #F44336;
}

.emotional-event.calm { 
  background-color: #98FB98;
  border: 1px solid #81C784;
}

/* Global styles */
:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

## Best Practices

1. **State Management**:
   - Use React's useState for local state
   - Consider using a state management library for complex state
   - Implement proper data persistence

2. **Performance**:
   - Use useCallback for event handlers
   - Enable virtual scrolling for better performance with many events
   - Lazy load calendar components

3. **User Experience**:
   - Provide clear visual feedback for emotional states
   - Implement drag-and-drop for event creation
   - Add tooltips for emotional context
   - Include quick emotion selection shortcuts

4. **Accessibility**:
   - Ensure proper ARIA labels
   - Maintain keyboard navigation
   - Provide alternative text for emojis
   - Support screen readers

## Implementation Steps

1. Set up Veaury and Vue Cal v5
2. Create the Vue Cal wrapper component
3. Implement the Emotional Calendar component
4. Add custom styling
5. Integrate with EmojiGridMapper
6. Implement data persistence
7. Add accessibility features
8. Test thoroughly

## Troubleshooting

Common issues and solutions:

1. **Vue Cal Integration Issues**:
   - Ensure proper Veaury setup
   - Check Vue Cal version compatibility (v5.0.0+)
   - Verify CSS imports (use `vue-cal/style`)
   - Make sure date prototypes are added
   - Check Vue 3.4.0+ requirement

2. **Event Creation Problems**:
   - Validate emotion selection before event creation
   - Handle edge cases for event timing
   - Implement proper error handling
   - Use new v5.0.0 event properties correctly

3. **Styling Conflicts**:
   - Use CSS modules or styled-components
   - Implement proper CSS specificity
   - Handle responsive design issues
   - Use new v5.0.0 CSS variables

## Future Enhancements

1. **Analytics**:
   - Track emotional patterns
   - Generate emotional state reports
   - Visualize emotional trends

2. **Features**:
   - Recurring emotional events
   - Emotional state reminders
   - Integration with other calendar systems
   - Export/import functionality

3. **UI/UX**:
   - Custom emotion categories
   - Advanced filtering
   - Timeline view
   - Mobile optimization

## Resources

- [Vue Cal Documentation](https://antoniandre.github.io/vue-cal/)
- [Vue Cal Release Notes](https://antoniandre.github.io/vue-cal/release-notes)
- [Veaury Documentation](https://github.com/devilwjp/veaury)
- [Emoji Grid Mapper Component](../src/components/EmojiGridMapper/EmojiGridMapper.tsx) 