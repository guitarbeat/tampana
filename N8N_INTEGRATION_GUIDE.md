# 🚀 Adding N8N Integration to Your Main App

## Quick Integration Steps

### 1. Add N8N Button to Main Interface

To add the N8N integration to your main Tampana app, you can add a button to the trailing accessories. Here's how:

```tsx
// In your App.tsx, add this to the trailingAccessories array:

const trailingAccessories = [
  // ... existing accessories ...
  {
    icon: '🔗',
    tooltip: 'N8N Integration (N)',
    onClick: () => setShowN8N(true), // Add this state
    isActive: showN8N, // Add this state
    color: showN8N ? '#007acc' : '#666'
  },
  // ... rest of accessories ...
];
```

### 2. Add State for N8N Dashboard

```tsx
// Add this state near your other useState declarations:
const [showN8N, setShowN8N] = useState<boolean>(false);
```

### 3. Add Keyboard Shortcut

```tsx
// In your useEffect for keyboard shortcuts, add:
case 'n': setShowN8N(prev => !prev); break;
```

### 4. Add N8N Dashboard to Render

```tsx
// In your render logic, add this condition:
{showN8N ? (
  <N8NDashboard />
) : showSettings ? (
  <SettingsPage
    // ... existing props ...
  />
) : (
  <EmotionalCalendar
    // ... existing props ...
  />
)}
```

### 5. Import the N8N Components

```tsx
// Add these imports at the top of your App.tsx:
const N8NDashboard = lazy(() => import('./components/N8NDashboard'));
const N8NDemo = lazy(() => import('./components/N8NDemo'));
```

## Alternative: Simple Demo Integration

If you want to start with just the demo, you can add:

```tsx
// Add to trailingAccessories:
{
  icon: '🚀',
  tooltip: 'N8N Demo (N)',
  onClick: () => setShowN8NDemo(true),
  isActive: showN8NDemo,
  color: showN8NDemo ? '#00d4ff' : '#666'
}

// Add state:
const [showN8NDemo, setShowN8NDemo] = useState<boolean>(false);

// Add to render:
{showN8NDemo ? (
  <N8NDemo />
) : showSettings ? (
  // ... existing code ...
)}
```

## Complete Integration Example

Here's a complete example of how to integrate N8N into your main app:

```tsx
import { useState, useRef, lazy, useEffect } from 'react';
// ... other imports ...
const N8NDashboard = lazy(() => import('./components/N8NDashboard'));

function ThemedApp() {
  // ... existing state ...
  const [showN8N, setShowN8N] = useState<boolean>(false);

  // ... existing useEffect and handlers ...

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // ... existing cases ...
      case 'n': setShowN8N(prev => !prev); break;
    };
    // ... rest of useEffect ...
  }, []);

  const trailingAccessories = [
    // ... existing accessories ...
    {
      icon: '🔗',
      tooltip: 'N8N Integration (N)',
      onClick: () => setShowN8N(prev => !prev),
      isActive: showN8N,
      color: showN8N ? '#007acc' : '#666'
    },
    // ... rest of accessories ...
  ];

  return (
    <AppContainer theme={theme}>
      <GlobalStyle />
      <VerticalSplit
        leadingAccessories={leadingAccessories}
        trailingAccessories={trailingAccessories}
        menuItems={menuItems}
      >
        <Panel>
          {showN8N ? (
            <N8NDashboard />
          ) : showSettings ? (
            <SettingsPage
              // ... existing props ...
            />
          ) : (
            <EmotionalCalendar
              // ... existing props ...
            />
          )}
        </Panel>
        <Panel>
          <EmojiGridMapper />
        </Panel>
      </VerticalSplit>
      <DataExport ref={dataExportRef} events={events} enableToasts={notificationsEnabled} />
    </AppContainer>
  );
}
```

## 🎯 Benefits of This Integration

1. **Seamless Access**: Users can access N8N features directly from the main interface
2. **Keyboard Shortcut**: Quick access with the 'N' key
3. **Visual Feedback**: Button shows active state when N8N dashboard is open
4. **Consistent UX**: Follows the same pattern as other features (Settings, etc.)

## 🔧 Testing the Integration

1. **Add the code** to your App.tsx
2. **Start the app** with `npm run dev`
3. **Press 'N'** or click the 🔗 button
4. **Navigate** to the N8N dashboard
5. **Configure** your connection to n8n.alw.lol
6. **Test** the integration features

## 🚀 What Happens Next

Once integrated, users can:
- **Access N8N features** directly from the main app
- **Configure connections** to their N8N instance
- **Deploy workflows** for emotional wellness automation
- **Monitor data flow** and integration status
- **Export emotional data** to N8N workflows

The integration maintains the same look and feel as your existing Tampana app while adding powerful automation capabilities!