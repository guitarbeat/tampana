import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { EventData } from '../../types/event-data';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: #fff;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: #ccc;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4ECDC4;
  }

  &::placeholder {
    color: #666;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4ECDC4;
  }

  &::placeholder {
    color: #666;
  }
`;

const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const EmotionSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

const EmotionButton = styled.button<{ selected: boolean; color: string }>`
  padding: 12px 8px;
  border: 2px solid ${props => props.selected ? props.color : '#333'};
  border-radius: 8px;
  background: ${props => props.selected ? `${props.color}20` : '#1a1a1a'};
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  &:hover {
    border-color: ${props => props.color};
    background: ${props => `${props.color}10`};
  }

  .emoji {
    font-size: 20px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #4ECDC4;
          color: #000;
          &:hover { background: #45B7B8; }
        `;
      case 'danger':
        return `
          background: #FF6B6B;
          color: #fff;
          &:hover { background: #FF5252; }
        `;
      default:
        return `
          background: #333;
          color: #fff;
          &:hover { background: #444; }
        `;
    }
  }}
`;

const emotions = [
  { key: 'happy', emoji: '😊', label: 'Happy', color: '#4ECDC4' },
  { key: 'sad', emoji: '😔', label: 'Sad', color: '#6C7CE0' },
  { key: 'angry', emoji: '😤', label: 'Angry', color: '#FF6B6B' },
  { key: 'calm', emoji: '😌', label: 'Calm', color: '#95E1D3' },
  { key: 'excited', emoji: '🤩', label: 'Excited', color: '#FFD93D' },
  { key: 'anxious', emoji: '😰', label: 'Anxious', color: '#FF8A65' },
  { key: 'neutral', emoji: '😐', label: 'Neutral', color: '#9E9E9E' },
  { key: 'grateful', emoji: '🙏', label: 'Grateful', color: '#A8E6CF' }
];

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<EventData>) => void;
  onDelete?: (eventId: string) => void;
  event?: EventData | null;
  initialDate?: Date;
  initialTime?: { start: Date; end: Date };
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
  initialTime
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('neutral');

  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event
        setTitle(event.title);
        setDescription(''); // Add description field to EventData type if needed
        setStartDate(event.start.toISOString().split('T')[0]);
        setStartTime(event.start.toTimeString().slice(0, 5));
        setEndDate(event.end.toISOString().split('T')[0]);
        setEndTime(event.end.toTimeString().slice(0, 5));
        setSelectedEmotion(event.emotion);
      } else {
        // Creating new event
        const now = initialDate || new Date();
        const start = initialTime?.start || now;
        const end = initialTime?.end || new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
        
        setTitle('');
        setDescription('');
        setStartDate(start.toISOString().split('T')[0]);
        setStartTime(start.toTimeString().slice(0, 5));
        setEndDate(end.toISOString().split('T')[0]);
        setEndTime(end.toTimeString().slice(0, 5));
        setSelectedEmotion('neutral');
      }
    }
  }, [isOpen, event, initialDate, initialTime]);

  const handleSave = () => {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    const selectedEmotionData = emotions.find(e => e.key === selectedEmotion) || emotions[6];
    
    const eventData: Partial<EventData> = {
      id: event?.id,
      title: title.trim() || 'Untitled Event',
      start: startDateTime,
      end: endDateTime,
      emotion: selectedEmotion,
      emoji: selectedEmotionData.emoji,
      class: `emotional-event ${selectedEmotion}`,
      background: false,
      allDay: false
    };

    onSave(eventData);
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{event ? 'Edit Event' : 'Create Event'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </CloseButton>
        </ModalHeader>

        <FormGroup>
          <Label>Event Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title..."
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label>Description (Optional)</Label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Start Time</Label>
          <TimeInputGroup>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </TimeInputGroup>
        </FormGroup>

        <FormGroup>
          <Label>End Time</Label>
          <TimeInputGroup>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </TimeInputGroup>
        </FormGroup>

        <FormGroup>
          <Label>How are you feeling?</Label>
          <EmotionSelector>
            {emotions.map((emotion) => (
              <EmotionButton
                key={emotion.key}
                selected={selectedEmotion === emotion.key}
                color={emotion.color}
                onClick={() => setSelectedEmotion(emotion.key)}
                type="button"
              >
                <span className="emoji">{emotion.emoji}</span>
                <span>{emotion.label}</span>
              </EmotionButton>
            ))}
          </EmotionSelector>
        </FormGroup>

        <ButtonGroup>
          {event && onDelete && (
            <Button variant="danger" onClick={handleDelete}>
              Delete Event
            </Button>
          )}
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EventModal;

