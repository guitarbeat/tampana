import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import n8nService from '../services/n8nService';
import { EmotionalData, EmotionalEvent } from '../types/n8n';

const Container = styled.div`
  padding: 24px;
  margin: 20px 0;
  border-radius: 16px;
  overflow: hidden;
`;

const Title = styled.h3`
  color: #fff;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ExportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const ExportCard = styled.div`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #444;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #007acc;
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h4`
  color: #fff;
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  color: #ccc;
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: #007acc;
          color: #fff;
          &:hover { background: #005a9e; }
        `;
      case 'secondary':
        return `
          background: #444;
          color: #fff;
          &:hover { background: #555; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: #fff;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #007acc;
          color: #fff;
          &:hover { background: #005a9e; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Alert = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return 'background: rgba(40, 167, 69, 0.1); border: 1px solid #28a745; color: #28a745;';
      case 'error':
        return 'background: rgba(220, 53, 69, 0.1); border: 1px solid #dc3545; color: #dc3545;';
      case 'info':
        return 'background: rgba(0, 122, 204, 0.1); border: 1px solid #007acc; color: #007acc;';
    }
  }}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #444;
  border-radius: 4px;
  overflow: hidden;
  margin: 12px 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #007acc;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const StatusText = styled.div`
  color: #ccc;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 8px;
`;

const RealTimeToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2a2a2a;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ToggleLabel = styled.div`
  color: #fff;
  font-weight: 500;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #007acc;
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #444;
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

interface N8NDataExportProps {
  events: EmotionalEvent[];
}

const N8NDataExport: React.FC<N8NDataExportProps> = ({ events }) => {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (isRealTimeEnabled) {
      // Set up real-time data streaming
      const interval = setInterval(() => {
        handleRealTimeSync();
      }, 60000); // Sync every minute

      return () => clearInterval(interval);
    }
  }, [isRealTimeEnabled, events]);

  const handleExportToN8N = async (format: 'json' | 'csv' | 'summary') => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const emotionalData = processEmotionalData(events);
      
      // Send to N8N via webhook
      const success = await n8nService.sendWebhook('daily_summary', {
        format,
        data: emotionalData,
        exportTimestamp: new Date().toISOString()
      });

      if (success) {
        setAlert({
          type: 'success',
          message: `Data exported to N8N successfully in ${format.toUpperCase()} format!`
        });
      } else {
        setAlert({
          type: 'error',
          message: 'Failed to export data to N8N'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Export failed'
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleRealTimeSync = async () => {
    try {
      const success = await n8nService.syncEmotionalData(events);
      if (success) {
        console.log('Real-time sync completed');
      }
    } catch (error) {
      console.error('Real-time sync failed:', error);
    }
  };

  const processEmotionalData = (events: EmotionalEvent[]): EmotionalData => {
    if (events.length === 0) {
      return {
        events: [],
        summary: {
          totalEvents: 0,
          dateRange: {
            start: new Date().toISOString(),
            end: new Date().toISOString()
          },
          emotionDistribution: {},
          averageIntensity: 0
        }
      };
    }

    const sortedEvents = events.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const emotionDistribution: Record<string, number> = {};
    let totalIntensity = 0;

    events.forEach(event => {
      emotionDistribution[event.emotion] = (emotionDistribution[event.emotion] || 0) + 1;
      totalIntensity += event.intensity;
    });

    return {
      events,
      summary: {
        totalEvents: events.length,
        dateRange: {
          start: sortedEvents[0].timestamp,
          end: sortedEvents[sortedEvents.length - 1].timestamp
        },
        emotionDistribution,
        averageIntensity: totalIntensity / events.length
      }
    };
  };

  const handlePatternDetection = async () => {
    try {
      const success = await n8nService.triggerPatternDetection(events);
      if (success) {
        setAlert({
          type: 'success',
          message: 'Pattern detection triggered and sent to N8N!'
        });
      } else {
        setAlert({
          type: 'info',
          message: 'No significant patterns detected in recent data'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Pattern detection failed'
      });
    }
  };

  return (
    <Container className="glass-card">
      <Title>N8N Data Export & Integration</Title>
      
      {alert && (
        <Alert type={alert.type}>
          {alert.message}
        </Alert>
      )}

      <RealTimeToggle>
        <ToggleLabel>Real-time Data Streaming</ToggleLabel>
        <ToggleSwitch>
          <ToggleInput
            type="checkbox"
            checked={isRealTimeEnabled}
            onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
      </RealTimeToggle>

      <ExportGrid>
        <ExportCard>
          <CardTitle>JSON Export</CardTitle>
          <CardDescription>
            Export emotional data in JSON format for N8N workflows
          </CardDescription>
          <Button
            $variant="primary"
            onClick={() => handleExportToN8N('json')}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export as JSON'}
          </Button>
        </ExportCard>

        <ExportCard>
          <CardTitle>CSV Export</CardTitle>
          <CardDescription>
            Export data in CSV format for spreadsheet analysis
          </CardDescription>
          <Button
            $variant="primary"
            onClick={() => handleExportToN8N('csv')}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export as CSV'}
          </Button>
        </ExportCard>

        <ExportCard>
          <CardTitle>Summary Report</CardTitle>
          <CardDescription>
            Generate emotional wellness summary for N8N processing
          </CardDescription>
          <Button
            $variant="primary"
            onClick={() => handleExportToN8N('summary')}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Summary'}
          </Button>
        </ExportCard>

        <ExportCard>
          <CardTitle>Pattern Detection</CardTitle>
          <CardDescription>
            Trigger N8N workflow for emotional pattern analysis
          </CardDescription>
          <Button
            $variant="secondary"
            onClick={handlePatternDetection}
            disabled={isExporting}
          >
            Detect Patterns
          </Button>
        </ExportCard>
      </ExportGrid>

      {isExporting && (
        <div>
          <ProgressBar>
            <ProgressFill progress={exportProgress} />
          </ProgressBar>
          <StatusText>Exporting data to N8N... {exportProgress}%</StatusText>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '16px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h4 style={{ color: '#fff', margin: '0 0 12px 0' }}>Export Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ color: '#007acc', fontSize: '1.5rem', fontWeight: '600' }}>{events.length}</div>
            <div style={{ color: '#999', fontSize: '0.8rem' }}>Total Events</div>
          </div>
          <div>
            <div style={{ color: '#28a745', fontSize: '1.5rem', fontWeight: '600' }}>
              {events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.intensity, 0) / events.length) : 0}
            </div>
            <div style={{ color: '#999', fontSize: '0.8rem' }}>Avg Intensity</div>
          </div>
          <div>
            <div style={{ color: '#ffc107', fontSize: '1.5rem', fontWeight: '600' }}>
              {new Set(events.map(e => e.emotion)).size}
            </div>
            <div style={{ color: '#999', fontSize: '0.8rem' }}>Unique Emotions</div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default N8NDataExport;