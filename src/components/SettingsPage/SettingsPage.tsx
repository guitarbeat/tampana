import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 30px;
  color: #e0e0e0;
  background: #1a1a1a;
  height: 100%;
  overflow-y: auto;
  
  h2 {
    color: #ffffff;
    margin-bottom: 30px;
    font-size: 24px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
  }
  
  .settings-section {
    margin-bottom: 30px;
    
    h3 {
      color: #ffffff;
      margin-bottom: 15px;
      font-size: 18px;
    }
  }
  
  .setting-item {
    margin-bottom: 20px;
    padding: 15px;
    background: #2a2a2a;
    border-radius: 8px;
    border: 1px solid #333;
    
    label {
      display: flex;
      align-items: center;
      font-weight: 500;
      cursor: pointer;
      
      input[type="checkbox"] {
        margin-right: 12px;
        width: 18px;
        height: 18px;
        accent-color: #4CAF50;
      }
      
      input[type="range"] {
        margin-left: 15px;
        flex: 1;
        max-width: 200px;
      }
      
      select {
        margin-left: 15px;
        padding: 5px 10px;
        background: #333;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
      }
    }
    
    .setting-description {
      margin-top: 8px;
      font-size: 14px;
      color: #aaa;
    }
  }
  
  .reset-section {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid #333;
    
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
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  showWeekends, 
  toggleWeekends, 
  timeFormat24h, 
  toggleTimeFormat 
}) => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [defaultView, setDefaultView] = useState('week');
  const [eventDuration, setEventDuration] = useState(60);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset all settings to default
      toggleWeekends();
      if (timeFormat24h) toggleTimeFormat();
      setNotifications(true);
      setAutoSave(true);
      setTheme('dark');
      setDefaultView('week');
      setEventDuration(60);
      
      // Clear localStorage
      localStorage.removeItem('tampana-events');
      localStorage.removeItem('tampana-settings');
      
      alert('Settings have been reset to default values.');
    }
  };

  return (
    <SettingsContainer>
      <h2>⚙️ Application Settings</h2>
      
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
        
        <div className="setting-item">
          <label>
            Theme:
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light (Coming Soon)</option>
            </select>
          </label>
          <div className="setting-description">
            Choose your preferred color theme for the application
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


