import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TopWrapper, BottomWrapper } from './Wrappers';
import {
  scaleDownButtonStyle
} from './helpers';

// Constants
const DIVIDER_HEIGHT = 10;

// Styled components
const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #000;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HomeIndicatorHandle = styled.div`
  position: relative;
  margin: auto;
  width: 40px;
  height: 5px;
  background: rgba(255,255,255,0.35);
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.18);
  cursor: grab;
  z-index: 20;
  user-select: none;
  touch-action: none;
  ${scaleDownButtonStyle}
  transition: background 0.15s;
  &:active {
    cursor: grabbing;
  }
`;

// Panel style objects (default, will be used in the component)
const defaultTopPanelStyle = {
  borderTopLeftRadius: 32,
  borderTopRightRadius: 32,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  overflow: 'hidden',
  top: 0,
  position: 'absolute' as const,
  width: '100%',
};

const defaultBottomPanelStyle = {
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  borderBottomLeftRadius: 32,
  borderBottomRightRadius: 32,
  overflow: 'hidden',
  position: 'absolute' as const,
  width: '100%',
};

// Divider component
const Divider = ({
  top,
  onMouseDown,
  onTouchStart,
}: {
  top: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      width: '100%',
      height: DIVIDER_HEIGHT,
      top,
      background: 'black',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <HomeIndicatorHandle
      style={{ position: 'relative', margin: 'auto', zIndex: 100 }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  </div>
);

// Interface for the VerticalSplit component props
interface VerticalSplitProps {
  topView: React.ReactNode;
  bottomView: React.ReactNode;
  topViewOverlay?: React.ReactNode;
  bottomViewOverlay?: React.ReactNode;
  bgColor?: string;
}

// Helper to compute scale (matches Wrappers.tsx)
function getPanelScale(height: number, containerHeight: number) {
  const heightRatio = height / containerHeight;
  return 1 - (1 - heightRatio) * 0.15;
}

// Given splitY, containerHeight, and divider height, solve for topHeight and bottomHeight
function getPanelHeights(splitY: number, containerHeight: number, dividerHeight: number) {
  // We'll solve for topHeight such that:
  // (containerHeight - bottomHeight * scaleBottom) - (topHeight * scaleTop) = dividerHeight
  // and topHeight + bottomHeight + dividerHeight <= containerHeight
  // We'll use a simple iterative approach for accuracy
  let topHeight = Math.max(0, splitY - dividerHeight / 2);
  let bottomHeight = Math.max(0, containerHeight - (splitY + dividerHeight / 2));

  // Iteratively adjust topHeight so that the scaled gap is correct
  for (let i = 0; i < 10; i++) {
    const scaleTop = getPanelScale(topHeight, containerHeight);
    const scaleBottom = getPanelScale(bottomHeight, containerHeight);
    const topPanelBottom = topHeight * scaleTop;
    const bottomPanelTop = containerHeight - bottomHeight * scaleBottom;
    const gap = bottomPanelTop - topPanelBottom;
    const error = gap - dividerHeight;
    if (Math.abs(error) < 0.5) break;
    // Adjust topHeight to reduce error
    topHeight += error * 0.5;
    topHeight = Math.max(0, Math.min(topHeight, containerHeight - dividerHeight));
    bottomHeight = containerHeight - topHeight - dividerHeight;
  }
  return { topHeight: Math.round(topHeight), bottomHeight: Math.round(bottomHeight) };
}

/**
 * A container that presents two views stacked vertically with an adjustable split.
 * This is a React implementation of the SwiftUI VerticalSplit component.
 */
const VerticalSplit: React.FC<VerticalSplitProps> = ({
  topView,
  bottomView,
  topViewOverlay,
  bottomViewOverlay,
  bgColor = "#ffffff"
}) => {
  // State variables
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitY, setSplitY] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      const height = containerRef.current?.clientHeight || window.innerHeight;
      setContainerHeight(height);
      setSplitY(prev => prev === 0 ? height / 2 : prev);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startSplitY = splitY;
    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newSplitY = startSplitY + (moveEvent.clientY - startY);
      newSplitY = Math.max(0, Math.min(containerRect.height, newSplitY));
      setSplitY(newSplitY);
    };
    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const startY = e.touches[0].clientY;
    const startSplitY = splitY;
    const onTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      if (!containerRef.current) return;
      let clientY = moveEvent.touches[0].clientY;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newSplitY = startSplitY + (clientY - startY);
      newSplitY = Math.max(0, Math.min(containerRect.height, newSplitY));
      setSplitY(newSplitY);
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      document.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('touchend', onTouchEnd as any);
    };
    document.addEventListener('touchmove', onTouchMove as any, { passive: false });
    document.addEventListener('touchend', onTouchEnd as any);
  };

  // Panel heights with fixed divider and scaling-aware gap
  const { topHeight, bottomHeight } = getPanelHeights(splitY, containerHeight, DIVIDER_HEIGHT);

  // Merge default panel styles with dynamic values
  const topPanelStyle = {
    ...defaultTopPanelStyle,
    backgroundColor: bgColor,
  };
  const bottomPanelStyle = {
    ...defaultBottomPanelStyle,
    backgroundColor: bgColor,
    top: splitY + DIVIDER_HEIGHT / 2,
  };

  return (
    <Container ref={containerRef} style={{ backgroundColor: '#000' }}>
      {topHeight > 1 && (
        <TopWrapper
          height={topHeight}
          containerHeight={containerHeight}
          style={topPanelStyle}
        >
          {topView}
          {topViewOverlay}
        </TopWrapper>
      )}
      <Divider
        top={splitY - DIVIDER_HEIGHT / 2}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
      {bottomHeight > 1 && (
        <BottomWrapper
          height={bottomHeight}
          containerHeight={containerHeight}
          style={bottomPanelStyle}
        >
          {bottomViewOverlay ? bottomViewOverlay : bottomView}
        </BottomWrapper>
      )}
    </Container>
  );
};

export default VerticalSplit;
