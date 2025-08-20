import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  N8NConfig,
  EmotionalData,
  EmotionalEvent,
  WebhookPayload,
  N8NResponse,
  SyncStatus,
  N8NWorkflowTemplate
} from '../types/n8n';

class N8NService {
  private axiosInstance: AxiosInstance;
  private config: N8NConfig;
  private syncStatus: SyncStatus;
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
    this.syncStatus = {
      lastSync: new Date().toISOString(),
      status: 'idle',
      eventsProcessed: 0,
      webhooksSent: 0
    };
    
    this.config = this.loadConfig();
    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey || ''
      }
    });

    this.setupInterceptors();
  }

  private loadConfig(): N8NConfig {
    const stored = localStorage.getItem('tampana_n8n_config');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default configuration
    return {
      baseUrl: 'https://n8n.alw.lol',
      enabled: false,
      autoSync: false,
      syncInterval: 15
    };
  }

  private saveConfig(): void {
    localStorage.setItem('tampana_n8n_config', JSON.stringify(this.config));
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.config.apiKey) {
          config.headers['X-API-Key'] = this.config.apiKey;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('N8N API Error:', error);
        this.updateSyncStatus('error', error.message);
        return Promise.reject(error);
      }
    );
  }

  public updateConfig(newConfig: Partial<N8NConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    
    // Recreate axios instance with new config
    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey || ''
      }
    });
    this.setupInterceptors();
  }

  public getConfig(): N8NConfig {
    return { ...this.config };
  }

  public async testConnection(): Promise<N8NResponse> {
    try {
      const response = await this.axiosInstance.get('/api/v1/health');
      return {
        success: true,
        message: 'Connection successful',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Connection failed',
        error: error.message
      };
    }
  }

  public async sendWebhook(eventType: WebhookPayload['eventType'], data: any): Promise<boolean> {
    if (!this.config.enabled || !this.config.webhookUrl) {
      return false;
    }

    try {
      const payload: WebhookPayload = {
        eventType,
        timestamp: new Date().toISOString(),
        data,
        sessionId: this.sessionId
      };

      await axios.post(this.config.webhookUrl, payload, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Tampana-Emotion-Tracker/1.0'
        }
      });

      this.updateSyncStatus('success');
      this.syncStatus.webhooksSent++;
      return true;
    } catch (error) {
      console.error('Webhook delivery failed:', error);
      this.updateSyncStatus('error', 'Webhook delivery failed');
      return false;
    }
  }

  public async syncEmotionalData(events: EmotionalEvent[]): Promise<boolean> {
    if (!this.config.enabled || !this.config.autoSync) {
      return false;
    }

    try {
      this.updateSyncStatus('syncing');
      
      const emotionalData = this.processEmotionalData(events);
      
      // Send webhook for data sync
      const success = await this.sendWebhook('daily_summary', emotionalData);
      
      if (success) {
        this.syncStatus.eventsProcessed = events.length;
        this.updateSyncStatus('success');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Data sync failed:', error);
      this.updateSyncStatus('error', 'Data sync failed');
      return false;
    }
  }

  private processEmotionalData(events: EmotionalEvent[]): EmotionalData {
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
  }

  public async getWorkflowTemplates(): Promise<N8NWorkflowTemplate[]> {
    try {
      const response = await this.axiosInstance.get('/api/v1/workflows/templates');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch workflow templates:', error);
      return [];
    }
  }

  public async createWorkflow(template: N8NWorkflowTemplate): Promise<N8NResponse> {
    try {
      const response = await this.axiosInstance.post('/api/v1/workflows', template);
      return {
        success: true,
        message: 'Workflow created successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create workflow',
        error: error.message
      };
    }
  }

  private updateSyncStatus(status: SyncStatus['status'], errorMessage?: string): void {
    this.syncStatus = {
      ...this.syncStatus,
      status,
      lastSync: new Date().toISOString(),
      errorMessage
    };
  }

  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  public async triggerPatternDetection(events: EmotionalEvent[]): Promise<boolean> {
    if (events.length < 3) return false; // Need at least 3 events for pattern detection
    
    const recentEvents = events.filter(event => {
      const eventDate = new Date(event.timestamp);
      const weekAgo = subDays(new Date(), 7);
      return eventDate >= weekAgo;
    });

    if (recentEvents.length >= 3) {
      // Simple pattern detection: check for consistent negative emotions
      const negativeEmotions = ['sad', 'angry', 'anxious', 'stressed', 'depressed'];
      const negativeCount = recentEvents.filter(event => 
        negativeEmotions.includes(event.emotion.toLowerCase())
      ).length;

      if (negativeCount >= recentEvents.length * 0.7) { // 70% negative emotions
        return await this.sendWebhook('pattern_detected', {
          pattern: 'negative_emotion_trend',
          events: recentEvents,
          severity: 'medium'
        });
      }
    }

    return false;
  }

  public async sendThresholdAlert(emotion: string, intensity: number, threshold: number): Promise<boolean> {
    if (intensity >= threshold) {
      return await this.sendWebhook('threshold_alert', {
        emotion,
        intensity,
        threshold,
        timestamp: new Date().toISOString()
      });
    }
    return false;
  }
}

export const n8nService = new N8NService();
export default n8nService;