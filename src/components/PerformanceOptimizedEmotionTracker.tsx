import React, { useState, useCallback, useMemo, memo } from 'react';
import styled from 'styled-components';
import { useDebounce, useThrottle, usePerformance } from '../hooks/usePerformance';
import { EmotionalEvent } from '../types/emotion-log';
import { Button, Card } from './common';

const Container = styled.div`
  padding: 24px;
  margin: 20px 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 1px solid #444;
`;

const Title = styled.h2`
  color: #fff;
  margin: 0 0 24px 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

const EmotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 8px;
  }
`;

const EmotionButton = styled.button<{ selected: boolean; intensity: number }>`
  background: ${({ selected, intensity }) => 
    selected 
      ? `hsl(${120 + (intensity - 1) * 20}, 70%, 50%)`
      : '#2a2a2a'
  };
  border: 2px solid ${({ selected }) => selected ? '#4ECDC4' : '#444'};
  border-radius: 12px;
  padding: 16px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 80px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:focus {
    outline: 2px solid #4ECDC4;
    outline-offset: 2px;
  }
  
  @media (max-width: 768px) {
    padding: 12px 4px;
    min-height: 60px;
  }
`;

const EmotionEmoji = styled.div`
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const EmotionLabel = styled.span`
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const IntensitySlider = styled.div`
  margin: 24px 0;
`;

const SliderLabel = styled.label`
  display: block;
  color: #fff;
  margin-bottom: 12px;
  font-weight: 500;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #444;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4ECDC4;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4ECDC4;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const IntensityValue = styled.div`
  color: #4ECDC4;
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 16px;
`;

const StatValue = styled.div`
  color: #4ECDC4;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #999;
  font-size: 0.9rem;
`;

const PerformanceMetrics = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
  border: 1px solid #333;
`;

const MetricsTitle = styled.h4`
  color: #fff;
  margin: 0 0 12px 0;
  font-size: 1rem;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const MetricLabel = styled.span`
  color: #ccc;
`;

const MetricValue = styled.span<{ good?: boolean }>`
  color: ${({ good }) => good ? '#2ed573' : '#ff6b6b'};
  font-weight: 500;
`;

interface PerformanceOptimizedEmotionTrackerProps {
  onEmotionLog: (emotion: string, intensity: number) => void;
  events: EmotionalEvent[];
  showPerformanceMetrics?: boolean;
}

const EMOTIONS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '😠', label: 'Angry', value: 'angry' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '🤗', label: 'Loved', value: 'loved' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😍', label: 'Excited', value: 'excited' },
  { emoji: '😔', label: 'Disappointed', value: 'disappointed' },
  { emoji: '😌', label: 'Grateful', value: 'grateful' },
  { emoji: '😟', label: 'Worried', value: 'worried' },
];

const PerformanceOptimizedEmotionTracker: React.FC<PerformanceOptimizedEmotionTrackerProps> = ({
  onEmotionLog,
  events,
  showPerformanceMetrics = false
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [isLogging, setIsLogging] = useState<boolean>(false);

  const { metrics, startRender, endRender } = usePerformance();
  
  // Debounce intensity changes to avoid excessive re-renders
  const debouncedIntensity = useDebounce(intensity, 100);
  
  // Throttle emotion logging to prevent spam
  const throttledLogEmotion = useThrottle(
    useCallback((emotion: string, intensity: number) => {
      onEmotionLog(emotion, intensity);
      setIsLogging(false);
    }, [onEmotionLog]),
    1000
  );

  // Memoize emotion statistics to avoid recalculation on every render
  const emotionStats = useMemo(() => {
    if (events.length === 0) {
      return {
        totalEvents: 0,
        averageIntensity: 0,
        mostCommonEmotion: 'None',
        recentEmotions: []
      };
    }

    const totalEvents = events.length;
    const averageIntensity = events.reduce((sum, event) => sum + event.intensity, 0) / totalEvents;
    
    // Count emotion frequencies
    const emotionCounts = events.reduce((counts, event) => {
      counts[event.emotion] = (counts[event.emotion] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'None';
    
    // Get recent emotions (last 5)
    const recentEmotions = events
      .slice(-5)
      .map(event => ({ emotion: event.emotion, intensity: event.intensity }))
      .reverse();

    return {
      totalEvents,
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      mostCommonEmotion,
      recentEmotions
    };
  }, [events]);

  // Memoize emotion grid to prevent unnecessary re-renders
  const emotionGrid = useMemo(() => (
    <EmotionGrid>
      {EMOTIONS.map(emotion => (
        <EmotionButton
          key={emotion.value}
          selected={selectedEmotion === emotion.value}
          intensity={selectedEmotion === emotion.value ? intensity : 0}
          onClick={() => setSelectedEmotion(emotion.value)}
          aria-label={`Select ${emotion.label} emotion`}
        >
          <EmotionEmoji>{emotion.emoji}</EmotionEmoji>
          <EmotionLabel>{emotion.label}</EmotionLabel>
        </EmotionButton>
      ))}
    </EmotionGrid>
  ), [selectedEmotion, intensity]);

  const handleIntensityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIntensity(Number(e.target.value));
  }, []);

  const handleLogEmotion = useCallback(() => {
    if (selectedEmotion && !isLogging) {
      setIsLogging(true);
      throttledLogEmotion(selectedEmotion, debouncedIntensity);
    }
  }, [selectedEmotion, debouncedIntensity, isLogging, throttledLogEmotion]);

  // Performance monitoring
  React.useEffect(() => {
    startRender();
    return () => endRender();
  });

  return (
    <Container>
      <Title>🎭 Emotion Tracker (Performance Optimized)</Title>
      
      {emotionGrid}
      
      <IntensitySlider>
        <SliderLabel htmlFor="intensity-slider">
          Intensity: {intensity}/10
        </SliderLabel>
        <Slider
          id="intensity-slider"
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={handleIntensityChange}
          aria-label="Emotion intensity slider"
        />
        <IntensityValue>{intensity}</IntensityValue>
      </IntensitySlider>
      
      <Button
        variant="primary"
        onClick={handleLogEmotion}
        disabled={!selectedEmotion || isLogging}
        loading={isLogging}
        fullWidth
      >
        {isLogging ? 'Logging...' : 'Log Emotion'}
      </Button>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{emotionStats.totalEvents}</StatValue>
          <StatLabel>Total Events</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{emotionStats.averageIntensity}</StatValue>
          <StatLabel>Avg Intensity</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{emotionStats.mostCommonEmotion}</StatValue>
          <StatLabel>Most Common</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{emotionStats.recentEmotions.length}</StatValue>
          <StatLabel>Recent</StatLabel>
        </StatCard>
      </StatsGrid>
      
      {showPerformanceMetrics && (
        <PerformanceMetrics>
          <MetricsTitle>Performance Metrics</MetricsTitle>
          <MetricRow>
            <MetricLabel>Render Count:</MetricLabel>
            <MetricValue>{metrics.renderCount}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Last Render Time:</MetricLabel>
            <MetricValue good={metrics.lastRenderTime < 16}>
              {metrics.lastRenderTime.toFixed(2)}ms
            </MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Average Render Time:</MetricLabel>
            <MetricValue good={metrics.averageRenderTime < 16}>
              {metrics.averageRenderTime.toFixed(2)}ms
            </MetricValue>
          </MetricRow>
        </PerformanceMetrics>
      )}
    </Container>
  );
};

export default memo(PerformanceOptimizedEmotionTracker);