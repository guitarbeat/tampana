import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import N8NConfigPanel from './N8NConfigPanel';
import N8NWorkflowManager from './N8NWorkflowManager';
import N8NDataExport from './N8NDataExport';
import n8nService from '../services/n8nService';
import { EmotionalEvent } from '../types/n8n';
import LoadingScreen from './LoadingScreen';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #007acc, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #ccc;
  font-size: 1.1rem;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const StatusBanner = styled.div<{ status: 'connected' | 'disconnected' | 'error' }>`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'connected':
        return 'background: rgba(40, 167, 69, 0.1); border: 1px solid #28a745; color: #28a745;';
      case 'disconnected':
        return 'background: rgba(108, 117, 125, 0.1); border: 1px solid #6c757d; color: #6c757d;';
      case 'error':
        return 'background: rgba(220, 53, 69, 0.1); border: 1px solid #dc3545; color: #dc3545;';
    }
  }}
`;

const StatusDot = styled.div<{ status: 'connected' | 'disconnected' | 'error' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  ${({ status }) => {
    switch (status) {
      case 'connected':
        return 'background: #28a745;';
      case 'disconnected':
        return 'background: #6c757d;';
      case 'error':
        return 'background: #dc3545;';
    }
  }}
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ActionCard = styled.div`
  padding: 20px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #007acc;
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 12px;
`;

const ActionTitle = styled.h3`
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ActionDescription = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const SectionDivider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent, #333, transparent);
  margin: 40px 0;
`;

const InfoPanel = styled.div`
  padding: 24px;
  margin: 20px 0;
`;

const InfoTitle = styled.h3`
  color: #fff;
  margin: 0 0 16px 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const InfoCard = styled.div`
  padding: 16px;
`;

const InfoLabel = styled.div`
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
`;

const N8NDashboard: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [isLoading, setIsLoading] = useState(true);
  const [mockEvents, setMockEvents] = useState<EmotionalEvent[]>([]);

  useEffect(() => {
    checkConnectionStatus();
    generateMockEvents();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const config = n8nService.getConfig();
      if (config.enabled && config.baseUrl) {
        const result = await n8nService.testConnection();
        setConnectionStatus(result.success ? 'connected' : 'error');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockEvents = () => {
    const emotions = ['happy', 'sad', 'excited', 'calm', 'anxious', 'content', 'frustrated', 'grateful'];
    const mockEvents: EmotionalEvent[] = [];
    
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockEvents.push({
        id: `event-${i}`,
        timestamp: date.toISOString(),
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: Math.floor(Math.random() * 10) + 1,
        notes: `Mock emotional event ${i + 1}`,
        tags: ['mock', 'demo']
      });
    }
    
    setMockEvents(mockEvents);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'test':
        checkConnectionStatus();
        break;
      case 'sync':
        n8nService.syncEmotionalData(mockEvents);
        break;
      case 'patterns':
        n8nService.triggerPatternDetection(mockEvents);
        break;
      case 'export':
        // This will be handled by the export component
        break;
    }
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingScreen message="Loading N8N Dashboard..." fullScreen={false} />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>N8N Integration Dashboard</Title>
        <Subtitle>
          Connect your Tampana emotional data with powerful N8N workflows for automated insights, 
          notifications, and integrations with your favorite tools and services.
        </Subtitle>
      </Header>

      <StatusBanner status={connectionStatus}>
        <StatusDot status={connectionStatus} />
        {connectionStatus === 'connected' && 'Connected to N8N Instance'}
        {connectionStatus === 'disconnected' && 'N8N Integration Disabled'}
        {connectionStatus === 'error' && 'Connection Error - Check Configuration'}
      </StatusBanner>

      <QuickActions>
        <ActionCard className="glass-card" onClick={() => handleQuickAction('test')}>
          <ActionIcon>🔌</ActionIcon>
          <ActionTitle>Test Connection</ActionTitle>
          <ActionDescription>Verify N8N connectivity</ActionDescription>
        </ActionCard>
        
        <ActionCard className="glass-card" onClick={() => handleQuickAction('sync')}>
          <ActionIcon>🔄</ActionIcon>
          <ActionTitle>Sync Data</ActionTitle>
          <ActionDescription>Send current data to N8N</ActionDescription>
        </ActionCard>
        
        <ActionCard className="glass-card" onClick={() => handleQuickAction('patterns')}>
          <ActionIcon>🔍</ActionIcon>
          <ActionTitle>Detect Patterns</ActionTitle>
          <ActionDescription>Analyze emotional trends</ActionDescription>
        </ActionCard>
        
        <ActionCard className="glass-card" onClick={() => handleQuickAction('export')}>
          <ActionIcon>📊</ActionIcon>
          <ActionTitle>Export Data</ActionTitle>
          <ActionDescription>Send data in various formats</ActionDescription>
        </ActionCard>
      </QuickActions>

      <InfoPanel className="glass-card">
        <InfoTitle>Integration Overview</InfoTitle>
        <InfoGrid>
          <InfoCard className="glass-card">
            <InfoLabel>Total Events</InfoLabel>
            <InfoValue>{mockEvents.length}</InfoValue>
          </InfoCard>
          <InfoCard className="glass-card">
            <InfoLabel>Last Sync</InfoLabel>
            <InfoValue>
              {n8nService.getSyncStatus().lastSync ? 
                new Date(n8nService.getSyncStatus().lastSync).toLocaleDateString() : 
                'Never'
              }
            </InfoValue>
          </InfoCard>
          <InfoCard className="glass-card">
            <InfoLabel>Webhooks Sent</InfoLabel>
            <InfoValue>{n8nService.getSyncStatus().webhooksSent}</InfoValue>
          </InfoCard>
          <InfoCard className="glass-card">
            <InfoLabel>Connection Status</InfoLabel>
            <InfoValue style={{ 
              color: connectionStatus === 'connected' ? '#28a745' : 
                     connectionStatus === 'error' ? '#dc3545' : '#6c757d'
            }}>
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </InfoValue>
          </InfoCard>
        </InfoGrid>
      </InfoPanel>

      <SectionDivider />

      <N8NConfigPanel />

      <SectionDivider />

      <N8NDataExport events={mockEvents} />

      <SectionDivider />

      <N8NWorkflowManager />
    </DashboardContainer>
  );
};

export default N8NDashboard;