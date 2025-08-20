import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsContainer = styled.div<{ theme: any }>`
  padding: 30px;
  color: ${props => props.theme.color};
  background: ${props => props.theme.background};
  height: 100%;
  overflow-y: auto;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  h2 {
    color: ${props => props.theme.color};
    margin-bottom: 30px;
    font-size: 24px;
    border-bottom: 2px solid ${props => props.theme.border};
    padding-bottom: 10px;
  }
  
  .settings-section {
    margin-bottom: 30px;
    
    h3 {
      color: ${props => props.theme.color};
      margin-bottom: 15px;
      font-size: 18px;
    }
  }
  
  .setting-item {
    margin-bottom: 20px;
    padding: 15px;
    background: ${props => props.theme.inputBackground};
    border-radius: 8px;
    border: 1px solid ${props => props.theme.border};
    transition: background-color 0.3s ease, border-color 0.3s ease;
    
    label {
      display: flex;
      align-items: center;
      font-weight: 500;
      cursor: pointer;
      color: ${props => props.theme.inputColor};
      
      input[type="checkbox"] {
        margin-right: 12px;
        width: 18px;
        height: 18px;
        accent-color: ${props => props.theme.primary};
      }
      
      input[type="range"] {
        margin-left: 15px;
        flex: 1;
        max-width: 200px;
        accent-color: ${props => props.theme.primary};
      }
      
      select {
        margin-left: 15px;
        padding: 5px 10px;
        background: ${props => props.theme.background};
        color: ${props => props.theme.color};
        border: 1px solid ${props => props.theme.border};
        border-radius: 4px;
      }
    }
    
    .setting-description {
      margin-top: 8px;
      font-size: 14px;
      color: ${props => props.theme.color === '#333333' ? '#666' : '#aaa'};
    }
  }
  
  .reset-section {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid ${props => props.theme.border};
    
    .reset-button {
      background: #f44336;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s;
      
      &:hover {
        background: #d32f2f;
      }
    }
  }
`;

interface SettingsPageProps {
  showWeekends: boolean;
  toggleWeekends: () => void;
  timeFormat24h: boolean;
  toggleTimeFormat: () => void;
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
  eventDuration: number;
  onChangeEventDuration: (minutes: number) => void;
  notifications: boolean;
  onChangeNotifications: (enabled: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  showWeekends, 
  toggleWeekends, 
  timeFormat24h, 
  toggleTimeFormat,
  themeName,
  toggleTheme,
  eventDuration,
  onChangeEventDuration,
  notifications,
  onChangeNotifications
}) => {
  const { theme } = useTheme();
  const [autoSave, setAutoSave] = useState(true);
  const [defaultView, setDefaultView] = useState('week');
  const [n8nEnabled, setN8nEnabled] = useState<boolean>(false);
  const [n8nBaseUrl, setN8nBaseUrl] = useState<string>('');
  const [n8nEventPath, setN8nEventPath] = useState<string>('/webhook/tampana/event-change');
  const [n8nExportPath, setN8nExportPath] = useState<string>('/webhook/tampana/export');
  const [n8nSummaryPath, setN8nSummaryPath] = useState<string>('/webhook/tampana/summary');
  const [n8nAuthHeader, setN8nAuthHeader] = useState<string>('');
  const [n8nAuthToken, setN8nAuthToken] = useState<string>('');

  // Load saved n8n config
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('tampanaN8N') || '{}';
      const cfg = JSON.parse(raw);
      setN8nEnabled(Boolean(cfg.enabled));
      setN8nBaseUrl(cfg.baseUrl || '');
      setN8nEventPath(cfg.eventPath || '/webhook/tampana/event-change');
      setN8nExportPath(cfg.exportPath || '/webhook/tampana/export');
      setN8nSummaryPath(cfg.summaryPath || '/webhook/tampana/summary');
      setN8nAuthHeader(cfg.authHeader || '');
      setN8nAuthToken(cfg.authToken || '');
    } catch (e) { /* ignore invalid JSON */ }
  }, []);

  const saveN8N = () => {
    const cfg = {
      enabled: n8nEnabled,
      baseUrl: n8nBaseUrl,
      eventPath: n8nEventPath,
      exportPath: n8nExportPath,
      summaryPath: n8nSummaryPath,
      authHeader: n8nAuthHeader || undefined,
      authToken: n8nAuthToken || undefined,
    };
    localStorage.setItem('tampanaN8N', JSON.stringify(cfg));
    alert('n8n settings saved');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset all settings to default
      if (showWeekends !== true) toggleWeekends();
      if (timeFormat24h !== false) toggleTimeFormat();
      if (themeName !== 'dark') toggleTheme();
      onChangeNotifications(true);
      setAutoSave(true);
      setDefaultView('week');
      onChangeEventDuration(60);
      
      // Clear localStorage
      localStorage.removeItem('tampanaEvents');
      localStorage.removeItem('tampanaSettings');
      localStorage.removeItem('tampanaTheme');
      
      alert('Settings have been reset to default values.');
    }
  };

  return (
    <SettingsContainer theme={theme}>
      <h2>⚙️ Application Settings</h2>
      
      <div className="settings-section">
        <h3>🎨 Appearance</h3>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={themeName === 'light'}
              onChange={toggleTheme}
            />
            Day Mode (Light Theme)
          </label>
          <div className="setting-description">
            Switch between day mode (light theme) and night mode (dark theme)
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>📅 Calendar Display</h3>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={toggleWeekends}
            />
            Show Weekends
          </label>
          <div className="setting-description">
            Display Saturday and Sunday in the calendar view
          </div>
        </div>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={timeFormat24h}
              onChange={toggleTimeFormat}
            />
            Use 24-hour Time Format
          </label>
          <div className="setting-description">
            Display time in 24-hour format (e.g., 14:30) instead of 12-hour format (e.g., 2:30 PM)
          </div>
        </div>
        
        <div className="setting-item">
          <label>
            Default Calendar View:
            <select 
              value={defaultView} 
              onChange={(e) => setDefaultView(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </label>
          <div className="setting-description">
            The calendar view that loads when you open the application
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>🎯 Event Management</h3>
        
        <div className="setting-item">
          <label>
            Default Event Duration (minutes):
            <input
              type="range"
              min="15"
              max="240"
              step="15"
              value={eventDuration}
              onChange={(e) => onChangeEventDuration(Number(e.target.value))}
            />
            <span style={{ marginLeft: '10px', minWidth: '60px' }}>{eventDuration}min</span>
          </label>
          <div className="setting-description">
            Default duration for new events when creating them
          </div>
        </div>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={() => setAutoSave(!autoSave)}
            />
            Auto-save Events
          </label>
          <div className="setting-description">
            Automatically save events to local storage as you create or modify them
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>🔔 Notifications & Preferences</h3>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => onChangeNotifications(!notifications)}
            />
            Enable Notifications
          </label>
          <div className="setting-description">
            Show success messages and confirmations for actions
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>🔗 n8n Integration</h3>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={n8nEnabled}
              onChange={() => setN8nEnabled(!n8nEnabled)}
            />
            Enable n8n integration
          </label>
          <div className="setting-description">
            Send event changes and exports to your n8n workflows
          </div>
        </div>

        <div className="setting-item">
          <label>
            Base URL
            <input
              type="text"
              value={n8nBaseUrl}
              onChange={(e) => setN8nBaseUrl(e.target.value)}
              placeholder="https://n8n.alw.lol"
              style={{ marginLeft: '15px' }}
            />
          </label>
          <div className="setting-description">Your n8n instance base URL</div>
        </div>

        <div className="setting-item">
          <label>
            Event Path
            <input
              type="text"
              value={n8nEventPath}
              onChange={(e) => setN8nEventPath(e.target.value)}
              placeholder="/webhook/tampana/event-change"
              style={{ marginLeft: '15px' }}
            />
          </label>
        </div>

        <div className="setting-item">
          <label>
            Export Path
            <input
              type="text"
              value={n8nExportPath}
              onChange={(e) => setN8nExportPath(e.target.value)}
              placeholder="/webhook/tampana/export"
              style={{ marginLeft: '15px' }}
            />
          </label>
        </div>

        <div className="setting-item">
          <label>
            Summary Path
            <input
              type="text"
              value={n8nSummaryPath}
              onChange={(e) => setN8nSummaryPath(e.target.value)}
              placeholder="/webhook/tampana/summary"
              style={{ marginLeft: '15px' }}
            />
          </label>
        </div>

        <div className="setting-item">
          <label>
            Auth Header
            <input
              type="text"
              value={n8nAuthHeader}
              onChange={(e) => setN8nAuthHeader(e.target.value)}
              placeholder="X-API-Key"
              style={{ marginLeft: '15px' }}
            />
          </label>
          <div className="setting-description">Optional header to include with requests</div>
        </div>

        <div className="setting-item">
          <label>
            Auth Token
            <input
              type="password"
              value={n8nAuthToken}
              onChange={(e) => setN8nAuthToken(e.target.value)}
              placeholder="your-token"
              style={{ marginLeft: '15px' }}
            />
          </label>
        </div>

        <div className="setting-item" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={saveN8N} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid ' + theme.border, background: theme.inputBackground, color: theme.inputColor }}>Save n8n Settings</button>
        </div>
      </div>

      <div className="reset-section">
        <h3>🔄 Reset Settings</h3>
        <button className="reset-button" onClick={handleReset}>
          Reset All Settings to Default
        </button>
        <div className="setting-description" style={{ marginTop: '10px' }}>
          This will reset all settings and clear all saved data. This action cannot be undone.
        </div>
      </div>
    </SettingsContainer>
  );
};

export default SettingsPage;


