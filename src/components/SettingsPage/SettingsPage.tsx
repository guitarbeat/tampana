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
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  showWeekends, 
  toggleWeekends, 
  timeFormat24h, 
  toggleTimeFormat,
  themeName,
  toggleTheme
}) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [defaultView, setDefaultView] = useState('week');
  const [eventDuration, setEventDuration] = useState(60);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset all settings to default
      if (showWeekends !== true) toggleWeekends();
      if (timeFormat24h !== false) toggleTimeFormat();
      if (themeName !== 'dark') toggleTheme();
      setNotifications(true);
      setAutoSave(true);
      setDefaultView('week');
      setEventDuration(60);
      
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
              onChange={(e) => setEventDuration(Number(e.target.value))}
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
              onChange={() => setNotifications(!notifications)}
            />
            Enable Notifications
          </label>
          <div className="setting-description">
            Show success messages and confirmations for actions
          </div>
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


