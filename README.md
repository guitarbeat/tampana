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

- [ ] Data persistence with Firebase
- [ ] Emotional analytics and insights
- [ ] Export/import functionality
- [ ] Mobile app version
- [ ] Integration with external calendar services



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


