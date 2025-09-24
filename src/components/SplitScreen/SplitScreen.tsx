import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import friction from '../../utils/friction';

// * Spring configuration for smooth animations
const springConfig = {
  damping: 50,
  mass: 0.3,
  stiffness: 120,
  duration: 300, // ms
};

interface SplitScreenProps {
  borderRadius: number;
  handleHeight: number;
  topSnapPointHeight: number;
  bottomSnapPointHeight: number;
  inBetweenSnapPoints: ({ height }: { height: number }) => number[];
  velocityThreshold?: number;
  maxVelocityThreshold?: number;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  children?: React.ReactNode;
}

// * Styled components for the split screen layout
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: black;
  overflow: hidden;
`;

const TopComponent = styled.div<{ 
  $height: number; 
  $borderRadius: number;
  $opacity: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${props => props.$height}px;
  background: white;
  border-bottom-left-radius: ${props => props.$borderRadius}px;
  border-bottom-right-radius: ${props => props.$borderRadius}px;
  z-index: 1;
  overflow: hidden;
  transition: height ${springConfig.duration}ms cubic-bezier(0.4, 0.0, 0.2, 1);
`;

const BottomComponent = styled.div<{ 
  $height: number; 
  $top: number; 
  $borderRadius: number;
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.$height}px;
  background: white;
  border-top-left-radius: ${props => props.$borderRadius}px;
  border-top-right-radius: ${props => props.$borderRadius}px;
  z-index: 1;
  overflow: hidden;
  transition: height ${springConfig.duration}ms cubic-bezier(0.4, 0.0, 0.2, 1);
`;

const Handle = styled.div<{ 
  $height: number; 
  $top: number;
  $isDragging: boolean;
}>`
  position: absolute;
  left: 0;
  right: 0;
  height: ${props => props.$height}px;
  top: ${props => props.$top}px;
  background: black;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  transition: ${props => props.$isDragging ? 'none' : `top ${springConfig.duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`};
`;

const HandleIndicator = styled.div`
  width: 60px;
  height: 7px;
  background: white;
  border-radius: 10px;
  opacity: 0.8;
`;

const ScrollableContent = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const IdleOverlay = styled.div<{ 
  $opacity: number;
  $height: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${props => props.$height}px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$opacity};
  transition: opacity ${springConfig.duration}ms ease;
  pointer-events: ${props => props.$opacity > 0.5 ? 'auto' : 'none'};
`;

const useSplitScreen = ({
  handleHeight,
  inBetweenSnapPoints,
  topSnapPointHeight,
  bottomSnapPointHeight,
  velocityThreshold = 400,
  maxVelocityThreshold = 2500,
}: Omit<SplitScreenProps, 'borderRadius'>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [bottomComponentHeight, setBottomComponentHeight] = useState(bottomSnapPointHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [currentSnapPointIndex, setCurrentSnapPointIndex] = useState(0);

  // * Calculate snap points based on container height
  const snapPoints = React.useMemo(() => {
    if (containerHeight === 0) return [bottomSnapPointHeight];
    return [
      bottomSnapPointHeight,
      ...inBetweenSnapPoints({ height: containerHeight }),
      containerHeight - topSnapPointHeight - handleHeight,
    ];
  }, [containerHeight, bottomSnapPointHeight, inBetweenSnapPoints, topSnapPointHeight, handleHeight]);

  // * Initialize container height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(window.innerHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // * Find closest snap point
  const findClosestSnapPoint = useCallback((height: number, velocity?: number) => {
    if (velocity && Math.abs(velocity) > maxVelocityThreshold) {
      // ! High velocity - snap to extremes
      return velocity < 0 ? snapPoints[snapPoints.length - 1] : snapPoints[0];
    }

    if (velocity && Math.abs(velocity) > velocityThreshold) {
      // ! Medium velocity - move to next/previous snap point
      const currentIndex = snapPoints.findIndex((point, index) => {
        const nextPoint = snapPoints[index + 1];
        return nextPoint ? height >= point && height < nextPoint : height >= point;
      });

      if (velocity < 0 && currentIndex < snapPoints.length - 1) {
        return snapPoints[currentIndex + 1];
      } else if (velocity > 0 && currentIndex > 0) {
        return snapPoints[currentIndex - 1];
      }
    }

    // * Default - find closest snap point
    return snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev;
    });
  }, [snapPoints, velocityThreshold, maxVelocityThreshold]);

  // * Handle mouse/touch start
  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    setStartHeight(bottomComponentHeight);
  }, [bottomComponentHeight]);

  // * Handle mouse/touch move
  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;

    const deltaY = startY - clientY; // ! Inverted for natural feel
    let newHeight = startHeight + deltaY;

    // * Apply friction at boundaries
    const minSnap = snapPoints[0];
    const maxSnap = snapPoints[snapPoints.length - 1];

    if (newHeight < minSnap) {
      const distance = minSnap - newHeight;
      newHeight = minSnap - friction(distance);
    } else if (newHeight > maxSnap) {
      const distance = newHeight - maxSnap;
      newHeight = maxSnap + friction(distance);
    }

    setBottomComponentHeight(newHeight);

    // * Update current snap point index
    const closestSnapPoint = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - newHeight) < Math.abs(prev - newHeight) ? curr : prev;
    });
    setCurrentSnapPointIndex(snapPoints.indexOf(closestSnapPoint));
  }, [isDragging, startY, startHeight, snapPoints]);

  // * Handle mouse/touch end
  const handleEnd = useCallback((velocity: number = 0) => {
    if (!isDragging) return;

    setIsDragging(false);
    const targetHeight = findClosestSnapPoint(bottomComponentHeight, velocity);
    setBottomComponentHeight(targetHeight);
    setCurrentSnapPointIndex(snapPoints.indexOf(targetHeight));
  }, [isDragging, bottomComponentHeight, findClosestSnapPoint, snapPoints]);

  // * Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientY);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientY);
  }, [handleStart]);

  // * Global mouse/touch event handlers
  useEffect(() => {
    if (!isDragging) return;

    let lastY = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      const velocity = lastY !== 0 ? (lastY - e.clientY) / (currentTime - lastTime) : 0;
      lastY = e.clientY;
      lastTime = currentTime;
      handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentTime = Date.now();
      const clientY = e.touches[0].clientY;
      const velocity = lastY !== 0 ? (lastY - clientY) / (currentTime - lastTime) : 0;
      lastY = clientY;
      lastTime = currentTime;
      handleMove(clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const currentTime = Date.now();
      const velocity = lastY !== 0 ? (lastY - e.clientY) / (currentTime - lastTime) : 0;
      handleEnd(velocity);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const currentTime = Date.now();
      const velocity = lastY !== 0 ? (lastY - (e.changedTouches[0]?.clientY || lastY)) / (currentTime - lastTime) : 0;
      handleEnd(velocity);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // * Calculate component dimensions
  const topHeight = containerHeight - bottomComponentHeight - handleHeight;
  const handleTop = containerHeight - bottomComponentHeight - handleHeight;

  // * Calculate progress for animations
  const snapPointProgress = React.useMemo(() => {
    if (snapPoints.length <= 1) return 0;
    const normalizedHeight = bottomComponentHeight;
    const totalRange = snapPoints[snapPoints.length - 1] - snapPoints[0];
    const currentRange = normalizedHeight - snapPoints[0];
    return totalRange > 0 ? (currentRange / totalRange) * (snapPoints.length - 1) : 0;
  }, [bottomComponentHeight, snapPoints]);

  // * Calculate idle overlay opacities
  const topIdleOpacity = Math.max(0, Math.min(1, 
    snapPointProgress < 1 ? (1 - snapPointProgress * 3) : 0
  ));

  const bottomIdleOpacity = Math.max(0, Math.min(1,
    snapPointProgress < 0.33 ? (1 - snapPointProgress * 3) : 0
  ));

  return {
    containerRef,
    topHeight,
    bottomComponentHeight,
    handleTop,
    handleMouseDown,
    handleTouchStart,
    isDragging,
    topIdleOpacity,
    bottomIdleOpacity,
  };
};

export const SplitScreen: React.FC<SplitScreenProps> = ({
  borderRadius,
  handleHeight,
  inBetweenSnapPoints,
  topSnapPointHeight,
  bottomSnapPointHeight,
  velocityThreshold,
  maxVelocityThreshold,
  topContent,
  bottomContent,
  children,
}) => {
  const {
    containerRef,
    topHeight,
    bottomComponentHeight,
    handleTop,
    handleMouseDown,
    handleTouchStart,
    isDragging,
    topIdleOpacity,
    bottomIdleOpacity,
  } = useSplitScreen({
    handleHeight,
    inBetweenSnapPoints,
    topSnapPointHeight,
    bottomSnapPointHeight,
    velocityThreshold,
    maxVelocityThreshold,
  });

  // * Extract content from props or children
  const childrenArray = React.Children.toArray(children);
  const effectiveTopContent = topContent ?? childrenArray[0] ?? (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Top Component</h2>
      {Array.from({ length: 70 }, (_, i) => (
        <p key={i}>Some scrollable content line {i + 1}</p>
      ))}
    </div>
  );
  
  const effectiveBottomContent = bottomContent ?? childrenArray[1] ?? (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Bottom Component</h2>
      <p>This is the bottom panel content</p>
    </div>
  );

  return (
    <Container ref={containerRef}>
      {/* Top Component */}
      <TopComponent
        $height={topHeight}
        $borderRadius={borderRadius}
        $opacity={1}
      >
        <ScrollableContent>
          {effectiveTopContent}
        </ScrollableContent>
        
        {/* Top Idle Overlay */}
        <IdleOverlay 
          $opacity={topIdleOpacity}
          $height={topSnapPointHeight}
        >
          <div>Idle Top</div>
        </IdleOverlay>
      </TopComponent>

      {/* Handle */}
      <Handle
        $height={handleHeight}
        $top={handleTop}
        $isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <HandleIndicator />
      </Handle>

      {/* Bottom Component */}
      <BottomComponent
        $height={bottomComponentHeight}
        $top={0}
        $borderRadius={borderRadius}
      >
        <ScrollableContent>
          {effectiveBottomContent}
        </ScrollableContent>

        {/* Bottom Idle Overlay */}
        <IdleOverlay 
          $opacity={bottomIdleOpacity}
          $height={bottomSnapPointHeight}
        >
          <div>Idle Bottom</div>
        </IdleOverlay>
      </BottomComponent>
    </Container>
  );
};

export default SplitScreen;
