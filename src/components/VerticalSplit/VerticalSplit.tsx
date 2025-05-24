import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SplitDetent, SplitDetentHelpers } from './SplitDetent';
import { TopWrapper, BottomWrapper } from './Wrappers';
import { LeadingAccessories, TrailingAccessories, MenuAccessories, SplitAccessory, MenuAccessory } from './Accessories';
import {
  getNotch,
  getSnappedPartition,
  vibrate,
  getScreenSize
} from './helpers';

// Constants matching the SwiftUI implementation
const SPACING = 36;
const LIL = 58;
const LIL2 = LIL * 3 / 2;
const LIL3 = LIL * 2;
const NOTCHES = 6;
const MIN_PANEL_HEIGHT = 100;

// Interface for the VerticalSplit component props
interface VerticalSplitProps {
  topView: React.ReactNode;
  bottomView: React.ReactNode;
  topViewOverlay?: React.ReactNode;
  bottomViewOverlay?: React.ReactNode;
  autoTopOverlay?: boolean;
  autoBottomOverlay?: boolean;
  topTitle?: string;
  bottomTitle?: string;
  initialDetent?: SplitDetent;
  bgColor?: string;
  leadingAccessories?: SplitAccessory[];
  trailingAccessories?: SplitAccessory[];
  menuAccessories?: MenuAccessory[];
  menuSymbol?: React.ReactNode;
}

// Styled components for the VerticalSplit
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
  /* pointer-events: none; */
  display: flex;
  flex-direction: column;
`;

// Replace SplitHandle with a Home-indicator style handle
const HomeIndicatorHandle = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 5px;
  background: rgba(255,255,255,0.35);
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.18);
  cursor: grab;
  z-index: 20;
  user-select: none;
  transition: background 0.2s;
  &:active {
    cursor: grabbing;
    background: rgba(255,255,255,0.55);
  }
`;

const ViewButton = styled.button`
  position: absolute;
  left: 50%;
  top: -38px;
  transform: translateX(-50%);
  background: #fff;
  color: #222;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: 22px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
  z-index: 30;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #f2f2f2;
    color: #000;
  }
`;


/**
 * A container that presents two views stacked vertically with an adjustable split.
 * This is a React implementation of the SwiftUI VerticalSplit component.
 */
const VerticalSplit: React.FC<VerticalSplitProps> = ({
  topView,
  bottomView,
  topViewOverlay,
  bottomViewOverlay,
  autoTopOverlay = true,
  autoBottomOverlay = true,
  topTitle = "Top",
  bottomTitle = "Bottom",
  initialDetent = SplitDetent.FRACTION_3_6,
  bgColor = "#ffffff",
  leadingAccessories = [],
  trailingAccessories = [],
  menuAccessories = [],
  menuSymbol
}) => {
  // State variables
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitY, setSplitY] = useState<number>(window.innerHeight / 2);
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number>(window.innerHeight);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      setContainerHeight(containerRef.current?.clientHeight || window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAnimating(false);
    const startY = e.clientY;
    const startSplitY = splitY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newSplitY = startSplitY + (moveEvent.clientY - startY);
      // Allow dragging all the way to the top or bottom
      newSplitY = Math.max(0, Math.min(containerRect.height, newSplitY));
      setSplitY(newSplitY);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      snapToNearestDetent();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAnimating(false);
    const startY = e.touches[0].clientY;
    const startSplitY = splitY;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (!containerRef.current) return;
      let clientY = moveEvent.touches[0].clientY;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newSplitY = startSplitY + (clientY - startY);
      newSplitY = Math.max(0, Math.min(containerRect.height, newSplitY));
      setSplitY(newSplitY);
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      snapToNearestDetent();
      document.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('touchend', onTouchEnd as any);
    };

    document.addEventListener('touchmove', onTouchMove as any, { passive: false });
    document.addEventListener('touchend', onTouchEnd as any);
  };

  // Snapping logic
  const snapToNearestDetent = () => {
    if (!containerRef.current) return;
    const threshold = 48; // px, for full-screen snap and detent snap
    const range = (containerHeight / 2) - MIN_PANEL_HEIGHT;
    // Convert splitY to partition (centered at 0)
    const partition = splitY - containerHeight / 2;
    // Snap to top (show only bottom)
    if (splitY <= threshold) {
      setIsAnimating(true);
      setSplitY(0);
      vibrate(0.5);
      setTimeout(() => setIsAnimating(false), 350);
      return;
    }
    // Snap to bottom (show only top)
    if (splitY >= containerHeight - threshold) {
      setIsAnimating(true);
      setSplitY(containerHeight);
      vibrate(0.5);
      setTimeout(() => setIsAnimating(false), 350);
      return;
    }
    // Otherwise, only snap to a detent if within threshold
    let closestDetent = null;
    let closestDist = Infinity;
    let snappedSplitY = splitY;
    for (let notch = 0; notch <= NOTCHES; notch++) {
      const snappedPartition = getSnappedPartition(notch, range);
      const detentSplitY = snappedPartition + containerHeight / 2;
      const dist = Math.abs(splitY - detentSplitY);
      if (dist < closestDist) {
        closestDist = dist;
        closestDetent = detentSplitY;
      }
    }
    if (closestDist <= threshold) {
      setIsAnimating(true);
      setSplitY(closestDetent);
      vibrate(0.5);
      setTimeout(() => setIsAnimating(false), 350);
      return;
    }
    // Otherwise, stay at released position
    setIsAnimating(false);
  };

  // Panel heights
  const topHeight = splitY;
  const bottomHeight = containerHeight - splitY;

  // Blur logic: never blur unless hidden
  const getTopMinimise = () => 0;
  const getBottomMinimise = () => 0;
  const isAccessoriesPill = false;

  return (
    <Container ref={containerRef}>
      <TopWrapper
        minimise={getTopMinimise()}
        overscroll={0}
        isFull={false}
        isShowingAccessories={isAccessoriesPill}
        bgColor={bgColor}
        content={topView}
        overlay={null}
        style={{
          height: topHeight,
          zIndex: 1,
          transition: isAnimating ? 'height 0.35s cubic-bezier(0.4,0.2,0.2,1)' : undefined
        }}
      />

      <HomeIndicatorHandle
        style={{
          top: topHeight - 2.5,
          display: 'flex',
          zIndex: 100,
          transition: isAnimating ? 'top 0.35s cubic-bezier(0.4,0.2,0.2,1)' : undefined
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />

      <BottomWrapper
        minimise={getBottomMinimise()}
        overscroll={0}
        isFull={false}
        isShowingAccessories={isAccessoriesPill}
        bgColor={bgColor}
        content={bottomView}
        overlay={null}
        style={{
          height: bottomHeight,
          zIndex: 1,
          transition: isAnimating ? 'height 0.35s cubic-bezier(0.4,0.2,0.2,1)' : undefined
        }}
      />
    </Container>
  );
};

export default VerticalSplit;
