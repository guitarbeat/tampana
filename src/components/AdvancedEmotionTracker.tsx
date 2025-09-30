import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { EmotionalEvent } from '../types/emotion-log';
import { EmotionalPattern, EmotionalInsight } from '../services/n8nAdvancedService';
import n8nAdvancedService from '../services/n8nAdvancedService';

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
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  color: #fff;
  margin: 0 0 16px 0;
  font-size: 1.3rem;
  font-weight: 500;
`;

const PatternGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const PatternCard = styled.div<{ severity: string }>`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid ${props => {
    switch (props.severity) {
      case 'critical': return '#ff4757';
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#444';
    }
  }};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const PatternHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const PatternName = styled.h4`
  color: #fff;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ConfidenceBadge = styled.div<{ confidence: number }>`
  background: ${props => {
    if (props.confidence >= 0.8) return '#2ed573';
    if (props.confidence >= 0.6) return '#ffa502';
    return '#ff6b6b';
  }};
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const PatternDescription = styled.p`
  color: #ccc;
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  color: #4ECDC4;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  color: #999;
  font-size: 0.8rem;
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;
  
  &:before {
    content: '💡';
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const InsightCard = styled.div<{ priority: string }>`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#444';
    }
  }};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const InsightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const InsightTitle = styled.h4`
  color: #fff;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const PriorityBadge = styled.div<{ priority: string }>`
  background: ${props => {
    switch (props.priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#444';
    }
  }};
  color: #fff;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const InsightDescription = styled.p`
  color: #ccc;
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: #4ECDC4;
  color: #1a1a1a;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #45b7b8;
  }
  
  &:focus {
    outline: 2px solid #4ECDC4;
    outline-offset: 2px;
  }
`;

const RefreshButton = styled.button`
  background: #4ECDC4;
  color: #1a1a1a;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;
  
  &:hover {
    background: #45b7b8;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #444;
  border-radius: 50%;
  border-top-color: #4ECDC4;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
`;

interface AdvancedEmotionTrackerProps {
  events: EmotionalEvent[];
}

const AdvancedEmotionTracker: React.FC<AdvancedEmotionTrackerProps> = ({ events }) => {
  const [patterns, setPatterns] = useState<EmotionalPattern[]>([]);
  const [insights, setInsights] = useState<EmotionalInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { handleAsyncError } = useErrorHandler({
    component: 'AdvancedEmotionTracker'
  });

  const loadPatterns = useCallback(async () => {
    try {
      setIsLoading(true);
      const detectedPatterns = await handleAsyncError(
        () => n8nAdvancedService.detectPatterns(),
        [],
        { action: 'loadPatterns' }
      );
      setPatterns(detectedPatterns || []);
    } catch (error) {
      console.error('Failed to load patterns:', error);
    } finally {
      setIsLoading(false);
    }
  }, [handleAsyncError]);

  const loadInsights = useCallback(async () => {
    try {
      setIsLoading(true);
      const generatedInsights = await handleAsyncError(
        () => n8nAdvancedService.generateInsights(),
        [],
        { action: 'loadInsights' }
      );
      setInsights(generatedInsights || []);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, [handleAsyncError]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadPatterns(), loadInsights()]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadPatterns, loadInsights]);

  const handleInsightAction = useCallback((action: () => void) => {
    try {
      action();
    } catch (error) {
      console.error('Failed to execute insight action:', error);
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      handleRefresh();
    }
  }, [events.length, handleRefresh]);

  return (
    <Container>
      <Title>
        🧠 Advanced Emotion Analytics
        {isLoading && <LoadingSpinner />}
      </Title>

      <RefreshButton onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
      </RefreshButton>

      {lastUpdated && (
        <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '24px' }}>
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      <Section>
        <SectionTitle>Detected Patterns</SectionTitle>
        {patterns.length === 0 ? (
          <EmptyState>
            No patterns detected yet. Add more emotional events to enable pattern detection.
          </EmptyState>
        ) : (
          <PatternGrid>
            {patterns.map(pattern => (
              <PatternCard key={pattern.id} severity={pattern.severity}>
                <PatternHeader>
                  <PatternName>{pattern.name}</PatternName>
                  <ConfidenceBadge confidence={pattern.confidence}>
                    {Math.round(pattern.confidence * 100)}% confidence
                  </ConfidenceBadge>
                </PatternHeader>
                <PatternDescription>{pattern.description}</PatternDescription>
                <MetricsGrid>
                  <Metric>
                    <MetricValue>{pattern.data.metrics.frequency.toFixed(1)}</MetricValue>
                    <MetricLabel>per day</MetricLabel>
                  </Metric>
                  <Metric>
                    <MetricValue>{pattern.data.metrics.intensity.toFixed(1)}</MetricValue>
                    <MetricLabel>avg intensity</MetricLabel>
                  </Metric>
                  <Metric>
                    <MetricValue>{pattern.data.metrics.duration}</MetricValue>
                    <MetricLabel>days</MetricLabel>
                  </Metric>
                </MetricsGrid>
                <InsightsList>
                  {pattern.data.insights.map((insight, index) => (
                    <InsightItem key={index}>{insight}</InsightItem>
                  ))}
                </InsightsList>
              </PatternCard>
            ))}
          </PatternGrid>
        )}
      </Section>

      <Section>
        <SectionTitle>Personalized Insights</SectionTitle>
        {insights.length === 0 ? (
          <EmptyState>
            No insights available yet. Continue tracking your emotions to receive personalized insights.
          </EmptyState>
        ) : (
          <InsightGrid>
            {insights.map(insight => (
              <InsightCard key={insight.id} priority={insight.priority}>
                <InsightHeader>
                  <InsightTitle>{insight.title}</InsightTitle>
                  <PriorityBadge priority={insight.priority}>
                    {insight.priority}
                  </PriorityBadge>
                </InsightHeader>
                <InsightDescription>{insight.description}</InsightDescription>
                {insight.actionable && insight.actions && (
                  <ActionButtons>
                    {insight.actions.map((action, index) => (
                      <ActionButton
                        key={index}
                        onClick={() => handleInsightAction(action.handler)}
                      >
                        {action.label}
                      </ActionButton>
                    ))}
                  </ActionButtons>
                )}
              </InsightCard>
            ))}
          </InsightGrid>
        )}
      </Section>
    </Container>
  );
};

export default AdvancedEmotionTracker;