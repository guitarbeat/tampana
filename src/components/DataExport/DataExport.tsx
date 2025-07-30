import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { EventData } from '../../types/event-data';

const ExportContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ExportButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${props => props.variant === 'secondary' ? '#333' : '#4ECDC4'};
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  &:hover {
    background: ${props => props.variant === 'secondary' ? '#444' : '#45B7B8'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1001;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: white;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: #3a3a3a;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #4ECDC4;
  }
`;

const NotificationToast = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4ECDC4;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(${props => props.show ? '0' : '100px'});
  opacity: ${props => props.show ? '1' : '0'};
  transition: all 0.3s ease;
  z-index: 1002;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface DataExportProps {
  events: EventData[];
}

const DataExport = forwardRef<any, DataExportProps>(({ events }, ref) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const showToast = (message: string) => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalEvents: events.length,
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        emotion: event.emotion,
        emoji: event.emoji,
        duration: Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60)) // duration in minutes
      }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const filename = `tampana-emotions-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonString, filename, 'application/json');
    showToast('Exported as JSON successfully!');
    setIsDropdownOpen(false);
  };

  const exportAsCSV = () => {
    const headers = ['ID', 'Title', 'Start Date', 'End Date', 'Emotion', 'Emoji', 'Duration (minutes)'];
    const csvRows = [
      headers.join(','),
      ...events.map(event => [
        event.id,
        `"${event.title.replace(/"/g, '""')}"`, // Escape quotes in title
        event.start.toISOString(),
        event.end.toISOString(),
        event.emotion,
        event.emoji,
        Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const filename = `tampana-emotions-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvString, filename, 'text/csv');
    showToast('Exported as CSV successfully!');
    setIsDropdownOpen(false);
  };

  const exportEmotionSummary = () => {
    const emotionCounts = events.reduce((acc, event) => {
      acc[event.emotion] = (acc[event.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEvents = events.length;
    const summary = {
      exportDate: new Date().toISOString(),
      totalEvents,
      emotionBreakdown: Object.entries(emotionCounts).map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / totalEvents) * 100)
      })).sort((a, b) => b.count - a.count),
      mostCommonEmotion: Object.entries(emotionCounts).reduce((a, b) => emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b)[0],
      dateRange: {
        earliest: events.length > 0 ? new Date(Math.min(...events.map(e => e.start.getTime()))).toISOString() : null,
        latest: events.length > 0 ? new Date(Math.max(...events.map(e => e.end.getTime()))).toISOString() : null
      }
    };

    const jsonString = JSON.stringify(summary, null, 2);
    const filename = `tampana-emotion-summary-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonString, filename, 'application/json');
    showToast('Emotion summary exported!');
    setIsDropdownOpen(false);
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    handleExport: () => {
      setIsDropdownOpen(!isDropdownOpen);
    },
    handleExportJSON: exportAsJSON,
    handleExportCSV: exportAsCSV,
    handleExportSummary: exportEmotionSummary
  }));

  return (
    <>
      <ExportContainer>
        <ExportButton
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Export data"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          Export Data
        </ExportButton>

        <DropdownMenu isOpen={isDropdownOpen}>
          <DropdownItem onClick={exportAsJSON}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M5,3H7V5H5V10A2,2 0 0,1 3,8V6A2,2 0 0,1 5,4V3M19,3V4A2,2 0 0,1 21,6V8A2,2 0 0,1 19,10V5H17V3H19M5,21V20A2,2 0 0,1 3,18V16A2,2 0 0,1 5,14V19H7V21H5M19,21H17V19H19V14A2,2 0 0,1 21,16V18A2,2 0 0,1 19,20V21M12,8A2,2 0 0,1 14,10V14A2,2 0 0,1 12,16H10V14H12V10H10V8H12Z" />
            </svg>
            Export as JSON
          </DropdownItem>
          
          <DropdownItem onClick={exportAsCSV}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M9.5,11.5C9.5,10.67 8.83,10 8,10C7.17,10 6.5,10.67 6.5,11.5V12.5C6.5,13.33 7.17,14 8,14C8.83,14 9.5,13.33 9.5,12.5V11.5M17.5,11.5C17.5,10.67 16.83,10 16,10C15.17,10 14.5,10.67 14.5,11.5V12.5C14.5,13.33 15.17,14 16,14C16.83,14 17.5,13.33 17.5,12.5V11.5M13,11H11V13H13V11Z" />
            </svg>
            Export as CSV
          </DropdownItem>
          
          <DropdownItem onClick={exportEmotionSummary}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z" />
            </svg>
            Emotion Summary
          </DropdownItem>
        </DropdownMenu>
      </ExportContainer>

      <NotificationToast show={showNotification}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
        </svg>
        Data exported successfully!
      </NotificationToast>
    </>
  );
});

export default DataExport;

