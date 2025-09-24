import React from 'react';
import { SplitScreen } from './SplitScreen';

const SplitScreenExample: React.FC = () => {
  return (
    <SplitScreen
      borderRadius={30}
      handleHeight={30}
      topSnapPointHeight={120}
      bottomSnapPointHeight={100}
      inBetweenSnapPoints={({ height }) => [height / 3, height / 1.5]}
    >
      {/* Top content */}
      <div style={{ padding: '20px' }}>
        <h1>Top Panel</h1>
        <p>This is the top panel content. You can put any React components here.</p>
        {/* Add some scrollable content */}
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i}>Scrollable content item {i + 1}</p>
        ))}
      </div>

      {/* Bottom content */}
      <div style={{ padding: '20px' }}>
        <h1>Bottom Panel</h1>
        <p>This is the bottom panel content. It can also contain any React components.</p>
        <p>Try dragging the handle to resize the panels!</p>
      </div>
    </SplitScreen>
  );
};

export default SplitScreenExample;
