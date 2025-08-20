# N8N Integration for Tampana

This document explains how to set up and use the N8N integration with your Tampana emotion tracking application.

## 🚀 Overview

The N8N integration allows you to connect your Tampana emotional data with powerful N8N workflows for automated insights, notifications, and integrations with external services.

## 📋 Prerequisites

- **N8N Instance**: Running at `n8n.alw.lol` (or your custom URL)
- **Tampana App**: Latest version with N8N integration components
- **Webhook Endpoint**: Configured in your N8N instance to receive emotional data

## 🔧 Setup Instructions

### 1. Configure N8N Connection

1. Open the Tampana app and navigate to the N8N Dashboard
2. In the **N8N Integration Configuration** panel:
   - Set **N8N Base URL** to `https://n8n.alw.lol`
   - (Optional) Add your **API Key** if authentication is required
   - Set **Webhook URL** to your N8N webhook endpoint (e.g., `https://n8n.alw.lol/webhook/emotions`)
   - Enable **N8N Integration**
   - Configure **Auto-Sync** and **Sync Interval** as needed

3. Click **Test Connection** to verify connectivity
4. Click **Save Configuration** to store your settings

### 2. Create Webhook in N8N

In your N8N instance, create a new workflow with a **Webhook** trigger:

1. **Add Webhook Node**:
   - Set HTTP method to `POST`
   - Copy the webhook URL from your Tampana configuration
   - Set response mode to `Last Node`

2. **Configure Webhook Data**:
   ```json
   {
     "eventType": "emotion_logged|pattern_detected|threshold_alert|daily_summary",
     "timestamp": "2024-01-01T12:00:00Z",
     "data": {
       "events": [...],
       "summary": {...}
     },
     "sessionId": "unique-session-id"
   }
   ```

3. **Add Processing Nodes**:
   - **Switch Node**: Route different event types
   - **Function Node**: Process emotional data
   - **HTTP Request Node**: Send notifications or integrate with external services

### 3. Deploy Workflow Templates

The app includes pre-built workflow templates for common use cases:

- **Daily Wellness Check-in**: Automated daily emotional wellness analysis
- **Pattern Detection**: Monitor for concerning emotional trends
- **Mood Boost Notifications**: Send encouraging content for negative emotions
- **Weekly Reports**: Generate comprehensive wellness summaries
- **Calendar Integration**: Schedule wellness activities automatically
- **Social Support Network**: Connect with support contacts when needed

## 📊 Data Flow

### Real-time Data Streaming

1. **User logs emotion** in Tampana
2. **Data is processed** and formatted for N8N
3. **Webhook is triggered** to your N8N instance
4. **Workflow processes** the emotional data
5. **Actions are executed** based on workflow logic

### Data Formats

#### Emotional Event
```json
{
  "id": "event-123",
  "timestamp": "2024-01-01T12:00:00Z",
  "emotion": "happy",
  "intensity": 8,
  "notes": "Had a great conversation with a friend",
  "tags": ["social", "positive"]
}
```

#### Emotional Data Summary
```json
{
  "events": [...],
  "summary": {
    "totalEvents": 15,
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-07T23:59:59Z"
    },
    "emotionDistribution": {
      "happy": 8,
      "calm": 4,
      "anxious": 2,
      "sad": 1
    },
    "averageIntensity": 7.2
  }
}
```

## 🎯 Use Cases

### 1. Wellness Monitoring
- **Daily Check-ins**: Automated emotional wellness assessments
- **Pattern Detection**: Identify concerning emotional trends early
- **Crisis Intervention**: Immediate response to severe distress

### 2. Personalized Support
- **Mood Boost**: Send encouraging content when needed
- **Activity Recommendations**: Suggest wellness activities based on emotional state
- **Social Connection**: Connect with support network at appropriate times

### 3. Data Analysis
- **Trend Analysis**: Track emotional patterns over time
- **Correlation Studies**: Link emotions with activities and habits
- **Progress Tracking**: Monitor wellness journey improvements

### 4. External Integrations
- **Calendar Apps**: Schedule wellness activities automatically
- **Communication Tools**: Send notifications via Slack, Discord, or email
- **Health Platforms**: Integrate with fitness trackers and health apps

## 🔒 Security & Privacy

### Data Protection
- **Local Storage**: Emotional data is stored locally in your browser
- **Encrypted Transmission**: All data sent to N8N is encrypted in transit
- **Session Management**: Unique session IDs for each integration session

### Access Control
- **API Key Authentication**: Secure access to N8N endpoints
- **Webhook Validation**: Verify webhook sources in your N8N workflows
- **Rate Limiting**: Prevent abuse through controlled data flow

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify N8N instance is running and accessible
   - Check base URL and API key configuration
   - Ensure firewall allows connections to your N8N instance

2. **Webhook Not Receiving Data**
   - Verify webhook URL is correct and accessible
   - Check N8N workflow is active and webhook node is configured
   - Test webhook endpoint manually

3. **Data Sync Issues**
   - Check auto-sync configuration
   - Verify emotional data exists in Tampana
   - Review browser console for error messages

### Debug Mode

Enable debug logging in your browser console to see detailed integration information:

```javascript
localStorage.setItem('tampana_debug', 'true');
```

## 📈 Advanced Configuration

### Custom Workflow Templates

Create your own workflow templates by extending the base structure:

```typescript
interface CustomWorkflowTemplate extends N8NWorkflowTemplate {
  customConfig: {
    // Your custom configuration
  };
}
```

### Pattern Detection Rules

Customize emotional pattern detection by modifying thresholds and time windows:

```typescript
const customPatterns = {
  negativeTrend: {
    threshold: 0.6,
    timeWindow: '5 days',
    emotions: ['sad', 'anxious', 'stressed']
  }
};
```

### Integration Extensions

Add support for additional external services:

```typescript
const externalIntegrations = {
  slack: { webhookUrl: 'your-slack-webhook' },
  discord: { webhookUrl: 'your-discord-webhook' },
  email: { smtpConfig: { /* your SMTP settings */ } }
};
```

## 🚀 Getting Started Examples

### Example 1: Simple Mood Alert

1. **Deploy** the "Mood Boost Notifications" template
2. **Configure** your preferred notification channels
3. **Test** by logging a negative emotion in Tampana
4. **Monitor** the workflow execution in N8N

### Example 2: Weekly Wellness Report

1. **Deploy** the "Weekly Wellness Report" template
2. **Set** your preferred report schedule (e.g., every Monday)
3. **Configure** export formats and destinations
4. **Receive** automated weekly emotional wellness insights

### Example 3: Calendar Integration

1. **Deploy** the "Calendar Integration" template
2. **Connect** your calendar service (Google, Outlook, etc.)
3. **Configure** wellness activity preferences
4. **Automate** scheduling based on emotional patterns

## 📚 Additional Resources

- **N8N Documentation**: [https://docs.n8n.io/](https://docs.n8n.io/)
- **Tampana App**: Your emotion tracking application
- **Webhook Testing**: Use tools like [webhook.site](https://webhook.site/) for testing

## 🤝 Support

If you encounter issues or need help:

1. **Check** the troubleshooting section above
2. **Review** N8N workflow logs for errors
3. **Verify** webhook endpoint accessibility
4. **Test** with simple webhook payloads first

## 🔄 Updates & Maintenance

The N8N integration is actively maintained and updated. New features include:

- **Enhanced Pattern Detection**: More sophisticated emotional trend analysis
- **Additional Workflow Templates**: Pre-built workflows for new use cases
- **Performance Improvements**: Faster data processing and webhook delivery
- **Security Enhancements**: Improved authentication and data protection

---

**Happy automating! 🎉**

Transform your emotional wellness journey with the power of N8N workflows and Tampana's comprehensive emotion tracking.