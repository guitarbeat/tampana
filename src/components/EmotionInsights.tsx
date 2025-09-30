import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { EmotionalEvent } from '../types/emotion-log';
import { Card, Button, Grid } from './common';

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

const InsightCard = styled(Card)`
  background: linear-gradient(135deg, #2a2a2a 0%, #333 100%);
  border: 1px solid #555;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border-color: #4ECDC4;
  }
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const InsightIcon = styled.div`
  font-size: 2rem;
  opacity: 0.8;
`;

const InsightTitle = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const InsightDescription = styled.p`
  color: #ccc;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const InsightValue = styled.div`
  color: #4ECDC4;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const InsightLabel = styled.div`
  color: #999;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TrendIndicator = styled.div<{ trend: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ trend }) => {
    switch (trend) {
      case 'up': return '#2ed573';
      case 'down': return '#ff6b6b';
      default: return '#ffa502';
    }
  }};
`;

const ChartContainer = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid #333;
`;

const ChartTitle = styled.h4`
  color: #fff;
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 500;
`;

const SimpleChart = styled.div`
  display: flex;
  align-items: end;
  gap: 4px;
  height: 100px;
  margin: 16px 0;
`;

const ChartBar = styled.div<{ height: number; color: string }>`
  background: ${({ color }) => color};
  height: ${({ height }) => height}%;
  min-height: 4px;
  border-radius: 2px;
  flex: 1;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const RecommendationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
`;

const RecommendationItem = styled.li`
  color: #ccc;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  
  &:before {
    content: '💡';
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const ActionButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;

interface EmotionInsightsProps {
  events: EmotionalEvent[];
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

interface EmotionTrend {
  emotion: string;
  count: number;
  averageIntensity: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface WeeklyPattern {
  day: string;
  averageIntensity: number;
  dominantEmotion: string;
  count: number;
}

const EmotionInsights: React.FC<EmotionInsightsProps> = ({ 
  events, 
  timeRange = 'month' 
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Filter events based on time range
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (selectedTimeRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return events.filter(event => new Date(event.timestamp) >= cutoff);
  }, [events, selectedTimeRange]);

  // Calculate emotion trends
  const emotionTrends = useMemo((): EmotionTrend[] => {
    const emotionMap = new Map<string, { count: number; totalIntensity: number; intensities: number[] }>();
    
    filteredEvents.forEach(event => {
      const existing = emotionMap.get(event.emotion) || { count: 0, totalIntensity: 0, intensities: [] };
      emotionMap.set(event.emotion, {
        count: existing.count + 1,
        totalIntensity: existing.totalIntensity + event.intensity,
        intensities: [...existing.intensities, event.intensity]
      });
    });

    return Array.from(emotionMap.entries()).map(([emotion, data]) => {
      const averageIntensity = data.totalIntensity / data.count;
      
      // Calculate trend (simplified - compare first half vs second half)
      const half = Math.floor(data.intensities.length / 2);
      const firstHalf = data.intensities.slice(0, half);
      const secondHalf = data.intensities.slice(half);
      
      const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, i) => sum + i, 0) / firstHalf.length : 0;
      const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, i) => sum + i, 0) / secondHalf.length : 0;
      
      const change = secondHalfAvg - firstHalfAvg;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      if (Math.abs(change) > 0.5) {
        trend = change > 0 ? 'up' : 'down';
      }
      
      return {
        emotion,
        count: data.count,
        averageIntensity,
        trend,
        change: Math.abs(change)
      };
    }).sort((a, b) => b.count - a.count);
  }, [filteredEvents]);

  // Calculate weekly patterns
  const weeklyPatterns = useMemo((): WeeklyPattern[] => {
    const dayMap = new Map<string, { totalIntensity: number; count: number; emotions: string[] }>();
    
    filteredEvents.forEach(event => {
      const day = new Date(event.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
      const existing = dayMap.get(day) || { totalIntensity: 0, count: 0, emotions: [] };
      dayMap.set(day, {
        totalIntensity: existing.totalIntensity + event.intensity,
        count: existing.count + 1,
        emotions: [...existing.emotions, event.emotion]
      });
    });

    return Array.from(dayMap.entries()).map(([day, data]) => {
      const averageIntensity = data.totalIntensity / data.count;
      
      // Find dominant emotion for this day
      const emotionCounts = data.emotions.reduce((counts, emotion) => {
        counts[emotion] = (counts[emotion] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
      
      const dominantEmotion = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';
      
      return {
        day,
        averageIntensity,
        dominantEmotion,
        count: data.count
      };
    }).sort((a, b) => {
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });
  }, [filteredEvents]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs: string[] = [];
    
    if (emotionTrends.length === 0) return recs;
    
    const totalEvents = filteredEvents.length;
    const averageIntensity = filteredEvents.reduce((sum, e) => sum + e.intensity, 0) / totalEvents;
    
    // High intensity recommendation
    if (averageIntensity >= 7) {
      recs.push('Your emotions have been quite intense lately. Consider practicing mindfulness or stress management techniques.');
    }
    
    // Negative emotion trend
    const negativeEmotions = emotionTrends.filter(trend => 
      ['sad', 'angry', 'anxious', 'stressed', 'frustrated'].includes(trend.emotion.toLowerCase())
    );
    
    if (negativeEmotions.length > 0) {
      const negativeCount = negativeEmotions.reduce((sum, trend) => sum + trend.count, 0);
      if (negativeCount / totalEvents > 0.6) {
        recs.push('You\'ve been experiencing more negative emotions recently. Consider reaching out to friends, family, or a mental health professional.');
      }
    }
    
    // Low activity recommendation
    if (totalEvents < 5) {
      recs.push('You haven\'t been tracking your emotions much lately. Regular tracking can help you understand your emotional patterns better.');
    }
    
    // Weekly pattern recommendation
    const weekendDays = weeklyPatterns.filter(p => ['Saturday', 'Sunday'].includes(p.day));
    const weekdayDays = weeklyPatterns.filter(p => !['Saturday', 'Sunday'].includes(p.day));
    
    if (weekendDays.length > 0 && weekdayDays.length > 0) {
      const weekendAvg = weekendDays.reduce((sum, d) => sum + d.averageIntensity, 0) / weekendDays.length;
      const weekdayAvg = weekdayDays.reduce((sum, d) => sum + d.averageIntensity, 0) / weekdayDays.length;
      
      if (Math.abs(weekendAvg - weekdayAvg) > 2) {
        recs.push('Your emotional patterns differ significantly between weekdays and weekends. Consider what factors might be causing this difference.');
      }
    }
    
    return recs;
  }, [emotionTrends, filteredEvents, weeklyPatterns]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: '#2ed573',
      sad: '#3742fa',
      angry: '#ff4757',
      anxious: '#ffa502',
      calm: '#4ECDC4',
      excited: '#ff6b6b',
      tired: '#999',
      loved: '#ff69b4',
      frustrated: '#ff6348',
      grateful: '#32cd32',
      worried: '#ffa500',
      disappointed: '#696969'
    };
    return colors[emotion.toLowerCase()] || '#4ECDC4';
  };

  return (
    <Container>
      <Title>🧠 Emotion Insights & Analytics</Title>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ color: '#fff', marginRight: '12px' }}>Time Range:</label>
        <select 
          value={selectedTimeRange} 
          onChange={(e) => setSelectedTimeRange(e.target.value as any)}
          style={{
            background: '#2a2a2a',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '6px',
            padding: '8px 12px'
          }}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="medium">
        <InsightCard>
          <InsightHeader>
            <InsightIcon>📊</InsightIcon>
            <InsightTitle>Total Events</InsightTitle>
          </InsightHeader>
          <InsightValue>{filteredEvents.length}</InsightValue>
          <InsightLabel>Emotions Logged</InsightLabel>
        </InsightCard>

        <InsightCard>
          <InsightHeader>
            <InsightIcon>⚡</InsightIcon>
            <InsightTitle>Average Intensity</InsightTitle>
          </InsightHeader>
          <InsightValue>
            {filteredEvents.length > 0 
              ? (filteredEvents.reduce((sum, e) => sum + e.intensity, 0) / filteredEvents.length).toFixed(1)
              : '0'
            }
          </InsightValue>
          <InsightLabel>Out of 10</InsightLabel>
        </InsightCard>

        <InsightCard>
          <InsightHeader>
            <InsightIcon>🎭</InsightIcon>
            <InsightTitle>Unique Emotions</InsightTitle>
          </InsightHeader>
          <InsightValue>{new Set(filteredEvents.map(e => e.emotion)).size}</InsightValue>
          <InsightLabel>Different Types</InsightLabel>
        </InsightCard>
      </Grid>

      <Grid columns={{ xs: 1, lg: 2 }} gap="large" style={{ marginTop: '32px' }}>
        <InsightCard>
          <InsightTitle>Top Emotions</InsightTitle>
          <InsightDescription>Your most frequently logged emotions</InsightDescription>
          
          {emotionTrends.slice(0, 5).map((trend, index) => (
            <div key={trend.emotion} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontWeight: '500' }}>
                  {index + 1}. {trend.emotion}
                </span>
                <TrendIndicator trend={trend.trend}>
                  {getTrendIcon(trend.trend)} {trend.count}
                </TrendIndicator>
              </div>
              <div style={{ 
                background: '#1a1a1a', 
                height: '8px', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: getEmotionColor(trend.emotion),
                  height: '100%',
                  width: `${(trend.count / Math.max(...emotionTrends.map(t => t.count))) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </InsightCard>

        <InsightCard>
          <InsightTitle>Weekly Patterns</InsightTitle>
          <InsightDescription>Your emotional patterns by day of the week</InsightDescription>
          
          <ChartContainer>
            <ChartTitle>Average Intensity by Day</ChartTitle>
            <SimpleChart>
              {weeklyPatterns.map((pattern) => (
                <ChartBar
                  key={pattern.day}
                  height={(pattern.averageIntensity / 10) * 100}
                  color={getEmotionColor(pattern.dominantEmotion)}
                  title={`${pattern.day}: ${pattern.averageIntensity.toFixed(1)} intensity`}
                />
              ))}
            </SimpleChart>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#999' }}>
              {weeklyPatterns.map(pattern => (
                <span key={pattern.day}>{pattern.day.slice(0, 3)}</span>
              ))}
            </div>
          </ChartContainer>
        </InsightCard>
      </Grid>

      {recommendations.length > 0 && (
        <InsightCard style={{ marginTop: '32px' }}>
          <InsightTitle>💡 Personalized Recommendations</InsightTitle>
          <InsightDescription>Based on your emotional patterns, here are some suggestions:</InsightDescription>
          
          <RecommendationList>
            {recommendations.map((rec, index) => (
              <RecommendationItem key={index}>{rec}</RecommendationItem>
            ))}
          </RecommendationList>
          
          <ActionButton variant="secondary">
            View Detailed Analysis
          </ActionButton>
        </InsightCard>
      )}
    </Container>
  );
};

export default EmotionInsights;