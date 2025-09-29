# 🎭 Tampana - Emotional Wellness Tracker

Tampana is a modern, intuitive emotion tracking application that helps you monitor, analyze, and understand your emotional patterns over time. Built with React and TypeScript, it features a beautiful calendar interface for logging emotions and provides powerful integrations with N8N for automated wellness workflows.

## ✨ Features

### Core Functionality
- **📅 Interactive Calendar**: Beautiful calendar interface powered by Vue Cal for emotion logging
- **😊 Emotion Tracking**: Rich emoji-based emotion selection and logging
- **🌙 Dark Mode**: Elegant dark/light theme toggle for comfortable use
- **📊 Data Export**: Export your emotional data in JSON and CSV formats
- **🔄 N8N Integration**: Connect with N8N workflows for automated wellness insights

### Advanced Features
- **🎨 Customizable Interface**: Adjustable calendar views (day, week, month)
- **⚡ Real-time Updates**: Instant calendar updates and visual feedback
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **🔒 Privacy-focused**: All data stored locally on your device
- **🧠 Pattern Recognition**: Integration with N8N for emotional pattern analysis

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher) - see `.nvmrc` for the exact version
- npm (v7 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/guitarbeat/tampana.git
   cd tampana
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to start using Tampana!

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔗 N8N Integration

Tampana features powerful integration with N8N for automated emotional wellness workflows.

### Setup N8N Integration

1. **Configure N8N Settings** in the app:
   - Navigate to Settings (⚙️ icon)
   - Enable N8N integration
   - Set your N8N instance base URL (e.g., `https://n8n.alw.lol`)
   - Configure webhook paths and authentication

2. **Available Webhooks:**
   - Event changes: `/webhook/tampana/event-change`
   - Data exports: `/webhook/tampana/export`
   - Summary reports: `/webhook/tampana/summary`

3. **Example Workflows:**
   - Automated mood pattern analysis
   - Daily/weekly emotional summaries
   - Wellness recommendations based on trends
   - Integration with other health apps

### N8N Features
- Real-time event synchronization
- Automated pattern detection
- Custom workflow triggers
- Comprehensive data export formats

## 📂 Project Structure

```
src/
├── components/           # React components
│   ├── EmotionalCalendar/   # Main calendar component
│   ├── EmojiGridMapper/     # Emoji selection interface
│   ├── N8NDemo/            # N8N integration demo
│   ├── SettingsPage/       # Application settings
│   └── SplitScreen/        # Split screen layout
├── contexts/            # React contexts
├── services/           # Business logic and API services
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── styles/            # Global styles and themes
```

## 🎨 Themes

Tampana supports both light and dark themes:
- Toggle between themes using the sun/moon icon
- Theme preference is automatically saved
- Elegant design optimized for extended use

## 📊 Data Management

### Local Storage
- All emotional data is stored locally in your browser
- No data is sent to external servers without your explicit consent
- Export capabilities for backup and analysis

### Export Formats
- **JSON**: Complete data export for N8N workflows
- **CSV**: Spreadsheet-compatible format for analysis
- **Summary Reports**: Formatted wellness summaries

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Development setup
- Code style guidelines
- Testing requirements
- Pull request process

## 📋 Roadmap

See our [todo.md](todo.md) for current development priorities and planned features.

### Upcoming Features
- Enhanced emotion categories and intensity levels
- Advanced analytics dashboard
- Cloud storage integration options
- Mobile app development
- Advanced N8N workflow templates

## 🔒 Privacy & Security

- **Local-first**: All data stored locally on your device
- **No tracking**: No analytics or tracking without consent
- **Secure**: Regular security updates and vulnerability monitoring
- **Transparent**: Open source for community review

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🆘 Support

- **Documentation**: Check the [Contributing Guide](CONTRIBUTING.md)
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Join our community discussions for questions and feedback

## ⭐ Acknowledgments

- Vue Cal for the beautiful calendar component
- React and TypeScript communities
- N8N for workflow automation capabilities
- All contributors and users of Tampana

---

Made with ❤️ for emotional wellness and self-awareness.
