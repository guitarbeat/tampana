# Tampana

A modern emotion tagging application built with React, TypeScript, and Vite. Tampana helps you track your emotional well-being by logging events and feelings using an interactive calendar and emoji grid system.

## 🚀 Features

- **Interactive Calendar** - Schedule events and tag them with emotions using Vue Cal integration
- **Emoji Grid** - Select your current mood on a draggable emoji grid
- **Emotion Tracking** - Visualize your emotional patterns over time
- **Multiple Views** - Day, week, and month calendar views
- **Customizable Interface** - Toggle weekends, time formats, and display options
- **Dark Theme** - Modern dark theme for better user experience
- **Responsive Design** - Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Material-UI, Styled Components
- **Calendar**: Vue Cal v5 (via Veaury bridge)
- **Styling**: CSS3, Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
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

   The application will be available at [http://localhost:3000](http://localhost:3000).

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm test` - Run unit tests

### Project Structure

```
src/
├── components/          # React components
│   ├── EmotionalCalendar.tsx
│   └── EmojiGridMapper/
├── styles/             # CSS and styling files
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── ErrorBoundary.tsx   # Error handling
└── main.tsx           # Application entry point
```

## 🎯 Usage

1. **Creating Events**: Click on any time slot in the calendar to create a new event
2. **Adding Emotions**: Use the emoji grid to select an emotion for your event
3. **Viewing Patterns**: Switch between day, week, and month views to see your emotional patterns
4. **Customization**: Use the toolbar to toggle weekends, time formats, and other display options

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## 📝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to get started, coding standards, and the development workflow.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔮 Roadmap

Our vision for Tampana is to create a comprehensive and intuitive emotional well-being tracker. Here's what's planned for future development:

### Short-Term Goals (Next 1-3 Months)

- [x] **Comprehensive Data Export**: Implement robust export functionalities (JSON, CSV, Emotion Summary) for user data.
- [x] **Enhanced Calendar View**: Improve the calendar/day view with better UI, navigation, and event management.
- [x] **Local Data Persistence**: Ensure all user data (events, settings) are saved locally using browser storage.
- [ ] **User Interface Refinements**: Further polish the UI/UX based on user feedback, including improved accessibility and responsiveness.
- [ ] **Settings Page**: Create a dedicated settings page for managing application preferences (e.g., time format, weekend display, notification settings).

### Mid-Term Goals (Next 3-6 Months)

- [ ] **Cloud Synchronization**: Implement secure cloud synchronization (e.g., Firebase, custom backend) to allow users to access their data across multiple devices.
- [ ] **Advanced Emotional Analytics**: Develop more sophisticated data visualization and insights into emotional patterns, trends, and correlations.
- [ ] **Customizable Emotions/Tags**: Allow users to define and manage their own emotions or tags beyond the default set.
- [ ] **Journaling Feature**: Integrate a simple journaling feature to add contextual notes to emotional events.

### Long-Term Goals (6+ Months)

- [ ] **Mobile Application**: Develop native iOS and Android applications for a seamless mobile experience.
- [ ] **Integration with External Services**: Explore integrations with other health and wellness platforms or calendar services.
- [ ] **Community Features**: Potentially add features for sharing insights (anonymously) or connecting with support communities.
- [ ] **AI-Powered Insights**: Leverage AI to provide personalized recommendations or identify subtle emotional patterns.

We are committed to continuously improving Tampana and welcome community contributions and feedback!



## 📸 Screenshots

### Main Calendar View

This is the main view of the Tampana application, showing the interactive calendar and the emoji grid. The decorator buttons on the drag/divider bar provide quick access to various features.

![Main Calendar View](./screenshots/tampana_main_view.png)

### Export Data Dropdown

This screenshot shows the dropdown menu for exporting data, accessible from the decorator buttons. You can export your emotional events as JSON, CSV, or get an emotion summary.

![Export Data Dropdown](./screenshots/tampana_export_dropdown.png)

### Menu Accessories

This screenshot displays the menu accessories, also accessible from the decorator buttons. It provides options to add new events, toggle edit mode, clear all events, and access additional export options.

![Menu Accessories](./screenshots/tampana_menu_accessories.png)


