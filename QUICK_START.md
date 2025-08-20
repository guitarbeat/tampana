# 🚀 Quick Start Guide - N8N Integration

## ⚡ Get Up and Running in 5 Minutes

### 1. Start the Development Server
```bash
cd /workspace
npm run dev
```

### 2. Open the App
Navigate to `http://localhost:3000` in your browser

### 3. Access the N8N Integration
- Click on the N8N integration button or navigate to the N8N dashboard
- You'll see the beautiful demo landing page

### 4. Launch the Dashboard
Click **"🚀 Launch N8N Dashboard"** to access the full integration interface

### 5. Configure Your Connection
In the **N8N Integration Configuration** panel:
- **N8N Base URL**: `https://n8n.alw.lol`
- **Webhook URL**: `https://n8n.alw.lol/webhook/emotions` (or your custom endpoint)
- **Enable N8N Integration**: Check this box
- Click **"Test Connection"** to verify

### 6. Test the Integration
- **Quick Actions**: Try the action cards at the top
- **Data Export**: Export sample emotional data to N8N
- **Workflow Templates**: Browse and deploy pre-built workflows

## 🔧 What to Test

### Connection Testing
- ✅ **Test Connection**: Verify N8N instance accessibility
- ✅ **Status Monitoring**: Check connection status indicator
- ✅ **Configuration Saving**: Ensure settings persist

### Data Flow
- ✅ **Real-time Sync**: Enable auto-sync and monitor data flow
- ✅ **Webhook Delivery**: Check webhook success rates
- ✅ **Pattern Detection**: Trigger emotional pattern analysis

### Workflow Management
- ✅ **Template Browsing**: View available workflow templates
- ✅ **Workflow Deployment**: Deploy templates to your N8N instance
- ✅ **Status Tracking**: Monitor deployed workflow status

## 🎯 Sample Workflows to Try

### 1. **Daily Wellness Check-in**
- Deploy the "Daily Wellness Check-in" template
- Configure for daily execution at 9 AM
- Test with sample emotional data

### 2. **Pattern Detection Alert**
- Deploy the "Emotional Pattern Detection" template
- Set threshold to 70% negative emotions
- Log multiple negative emotions to trigger the workflow

### 3. **Mood Boost Notifications**
- Deploy the "Mood Boost Notifications" template
- Configure your preferred notification channels
- Test by logging a negative emotion

## 🐛 Troubleshooting

### Common Issues

**Connection Failed**
- Verify `n8n.alw.lol` is accessible from your browser
- Check if your N8N instance is running
- Ensure no firewall blocking the connection

**Webhook Not Working**
- Create a webhook trigger in your N8N instance
- Use the webhook URL from your configuration
- Test with a simple POST request first

**Data Not Syncing**
- Check auto-sync is enabled
- Verify webhook URL is correct
- Monitor browser console for errors

### Debug Mode
Enable detailed logging:
```javascript
// In browser console
localStorage.setItem('tampana_debug', 'true');
// Refresh the page
```

## 📱 What You'll See

### Dashboard Features
- **Status Banner**: Connection status with visual indicators
- **Quick Actions**: One-click access to common tasks
- **Integration Overview**: Statistics and metrics
- **Configuration Panel**: N8N connection settings
- **Data Export**: Multiple export options
- **Workflow Manager**: Template browsing and deployment

### Sample Data
The integration includes mock emotional data for testing:
- 15 sample emotional events
- Various emotions and intensity levels
- Realistic timestamps and patterns

## 🔗 Next Steps

### After Testing
1. **Customize Workflows**: Adapt templates to your needs
2. **Set Up Production**: Configure for real emotional data
3. **Monitor Performance**: Track webhook delivery and workflow execution
4. **Extend Functionality**: Add custom workflows and integrations

### Integration Ideas
- **Slack Notifications**: Send wellness updates to your team
- **Calendar Integration**: Schedule wellness activities automatically
- **Health Tracking**: Correlate emotions with fitness data
- **Social Support**: Connect with friends and family when needed

## 🎉 You're Ready!

The N8N integration is fully functional and ready to transform your Tampana app into an automated wellness platform. 

**Start exploring and see what's possible with emotional data automation! 🚀**

---

**Need Help?** Check the comprehensive documentation in `N8N_INTEGRATION_README.md`