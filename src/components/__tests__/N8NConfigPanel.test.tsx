import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import N8NConfigPanel from '../N8NConfigPanel';

// Mock the n8nService
jest.mock('../../services/n8nService', () => ({
  getConfig: jest.fn(() => ({
    enabled: false,
    baseUrl: '',
    eventPath: '/webhook/tampana/event-change',
    exportPath: '/webhook/tampana/export',
    summaryPath: '/webhook/tampana/summary',
    authHeader: '',
    authToken: ''
  })),
  updateConfig: jest.fn(),
  testConnection: jest.fn(() => Promise.resolve({ 
    success: true, 
    message: 'Connection successful',
    data: null,
    timestamp: new Date().toISOString()
  }))
}));

describe('N8NConfigPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the configuration form', () => {
    render(<N8NConfigPanel />);

    expect(screen.getByText('N8N Integration Settings')).toBeInTheDocument();
    expect(screen.getByLabelText(/base url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event webhook path/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/test connection/i)).toBeInTheDocument();
  });

  it('shows validation errors for invalid URLs', async () => {
    render(<N8NConfigPanel />);

    const baseUrlInput = screen.getByLabelText(/base url/i);
    fireEvent.change(baseUrlInput, { target: { value: 'invalid-url' } });
    fireEvent.blur(baseUrlInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });
  });

  it('accepts valid URLs without validation errors', async () => {
    render(<N8NConfigPanel />);

    const baseUrlInput = screen.getByLabelText(/base url/i);
    fireEvent.change(baseUrlInput, { target: { value: 'https://n8n.example.com' } });
    fireEvent.blur(baseUrlInput);

    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid url/i)).not.toBeInTheDocument();
    });
  });

  it('enables connection test when base URL is provided', async () => {
    render(<N8NConfigPanel />);

    const baseUrlInput = screen.getByLabelText(/base url/i);
    const testButton = screen.getByRole('button', { name: /test connection/i });

    expect(testButton).toBeDisabled();

    fireEvent.change(baseUrlInput, { target: { value: 'https://n8n.example.com' } });

    await waitFor(() => {
      expect(testButton).not.toBeDisabled();
    });
  });

  it('handles successful connection test', async () => {
    const mockN8nService = require('../../services/n8nService');
    
    render(<N8NConfigPanel />);

    const baseUrlInput = screen.getByLabelText(/base url/i);
    fireEvent.change(baseUrlInput, { target: { value: 'https://n8n.example.com' } });

    const testButton = screen.getByRole('button', { name: /test connection/i });
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(mockN8nService.testConnection).toHaveBeenCalled();
      expect(screen.getByText(/connection successful/i)).toBeInTheDocument();
    });
  });

  it('displays proper accessibility attributes', () => {
    render(<N8NConfigPanel />);

    const baseUrlInput = screen.getByLabelText(/base url/i);
    expect(baseUrlInput).toHaveAttribute('type', 'url');
    expect(baseUrlInput).toHaveAttribute('required');

    const enabledCheckbox = screen.getByLabelText(/enable n8n integration/i);
    expect(enabledCheckbox).toHaveAttribute('type', 'checkbox');
    expect(enabledCheckbox).toHaveAttribute('role', 'switch');
  });

  it('shows help text for webhook paths', () => {
    render(<N8NConfigPanel />);

    expect(screen.getByText(/webhook path for event notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/webhook path for data exports/i)).toBeInTheDocument();
  });
});