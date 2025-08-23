import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { scaleDownButtonStyle, vibrate, getPanelScale } from './utils';
import { useTheme } from '../../contexts/ThemeContext';

// Constants
const DIVIDER_HEIGHT = 20;
const ACCESSORY_SIZE = 24;
const ACCESSORY_SPACING = 8;
const EDGE_RESISTANCE_THRESHOLD = 50; // pixels from edge
const EDGE_RESISTANCE_FACTOR = 0.75; // movement multiplier
const HAPTIC_THRESHOLD = 10; // pixels of overscroll to trigger haptic
const MINIMIZE_SCALE_THRESHOLD = 100; // pixels from edge to start scaling
const SNAP_THRESHOLD = 60; // pixels from edge to auto-close

// Types for accessories
interface SplitAccessory {
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  tooltip?: string;
  isActive?: boolean;
}

interface MenuAccessory {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

// Styled components
const Container = styled.div<{ $backgroundColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: ${props => props.$backgroundColor};
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 32px;
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

// Accessory button styles
const AccessoryButton = styled.button<{ $color?: string; $isActive?: boolean }>`
  width: ${ACCESSORY_SIZE}px;
  height: ${ACCESSORY_SIZE}px;
  border-radius: 50%;
  background: ${props =>
    props.$isActive
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(255, 255, 255, 0.05)'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$color || 'white'};
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  padding: 0;
  margin: 0 ${ACCESSORY_SPACING / 2}px;
  box-shadow: ${props =>
    props.$isActive ? '0 0 0 2px rgba(255, 255, 255, 0.2)' : 'none'};
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AccessoriesContainer = styled.div`
  display: flex;
  align-items: center;
  z-index: 100;
`;

const AccessoryWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover .vs-tooltip {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, 4px);
  background: rgba(30, 30, 30, 0.95);
  color: #fff;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled(AccessoryButton)`
  position: relative;
`;

const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: ${ACCESSORY_SIZE + 10}px;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
  min-width: 180px;
`;

const MenuItem = styled.button<{ $color?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: ${props => props.$color || 'white'};
  cursor: pointer;
  border-radius: 8px;
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
`;

const RestoreButton = styled.button<{ $position: 'top' | 'bottom' }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  ${props => props.$position === 'top' ? 'top: 8px;' : 'bottom: 8px;'}
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 4px 8px;
  cursor: pointer;
  z-index: 200;
  ${scaleDownButtonStyle}
`;

// Panel styled components
const Panel = styled.div<{ $height: number; $backgroundColor: string; $scale?: number }>`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: ${props => props.$height}px;
  background: ${props => props.$backgroundColor};
  overflow: hidden;
  box-sizing: border-box;
  transform: scale(${props => props.$scale || 1});
  transform-origin: ${props => props.$scale && props.$scale < 1 ? 'center top' : 'center center'};
  transition: height 0.25s ease, transform 0.2s ease-out;
`;

const TopPanel = styled(Panel)`
  top: 0;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
`;

const BottomPanel = styled(Panel)<{ $top: number; $scale?: number }>`
  top: ${props => props.$top}px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  transition: top 0.25s ease, height 0.25s ease, transform 0.2s ease-out;
`;

const ContentContainer = styled.div<{ $position: 'top' | 'bottom' }>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
  box-sizing: border-box;
  border-top-left-radius: ${props => props.$position === 'top' ? '32px' : '0'};
  border-top-right-radius: ${props => props.$position === 'top' ? '32px' : '0'};
  border-bottom-left-radius: ${props => props.$position === 'bottom' ? '32px' : '0'};
  border-bottom-right-radius: ${props => props.$position === 'bottom' ? '32px' : '0'};
  padding: 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  
  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    margin: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
    border-radius: 4px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.25));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

// Divider component with accessories
const Divider = ({
  top,
  onMouseDown,
  onTouchStart,
  leadingAccessories,
  trailingAccessories,
  menuAccessories,
  menuIcon,
  menuColor,
}: {
  top: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  leadingAccessories?: SplitAccessory[];
  trailingAccessories?: SplitAccessory[];
  menuAccessories?: MenuAccessory[];
  menuIcon?: React.ReactNode;
  menuColor?: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
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
        cursor: 'grab',
        transition: 'top 0.25s ease',
      }}
    >
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 16px',
        position: 'relative',
        zIndex: 100
      }}>
        {/* Leading accessories */}
        {leadingAccessories && leadingAccessories.length > 0 && (
          <AccessoriesContainer>
            {leadingAccessories.map((accessory, index) => (
              <AccessoryWrapper key={`leading-${index}`}>
                <AccessoryButton
                  onClick={(e) => {
                    e.stopPropagation();
                    accessory.onClick();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  $color={accessory.color}
                  $isActive={accessory.isActive}
                  aria-label={accessory.tooltip}
                  title={accessory.tooltip}
                >
                  {accessory.icon}
                </AccessoryButton>
                {accessory.tooltip && (
                  <Tooltip className="vs-tooltip">{accessory.tooltip}</Tooltip>
                )}
              </AccessoryWrapper>
            ))}
          </AccessoriesContainer>
        )}
        
        {/* Center handle - this is the draggable area */}
        <div
          style={{
            position: 'relative',
            margin: 'auto',
            zIndex: 100,
            padding: '10px 20px', // Larger touch target
            cursor: 'grab',
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <HomeIndicatorHandle />
        </div>
        
        {/* Trailing accessories */}
        <AccessoriesContainer>
          {trailingAccessories && trailingAccessories.map((accessory, index) => (
            <AccessoryWrapper key={`trailing-${index}`}>
              <AccessoryButton
                onClick={(e) => {
                  e.stopPropagation();
                  accessory.onClick();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                $color={accessory.color}
                $isActive={accessory.isActive}
                aria-label={accessory.tooltip}
                title={accessory.tooltip}
              >
                {accessory.icon}
              </AccessoryButton>
              {accessory.tooltip && (
                <Tooltip className="vs-tooltip">{accessory.tooltip}</Tooltip>
              )}
            </AccessoryWrapper>
          ))}
          
          {/* Menu button if menu accessories exist */}
          {menuAccessories && menuAccessories.length > 0 && (
            <MenuWrapper ref={menuRef}>
              <MenuButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(e);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                $color={menuColor}
                $isActive={isMenuOpen}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
              >
                {menuIcon || (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                )}
              </MenuButton>

              {/* Menu dropdown */}
              <MenuContainer
                $isOpen={isMenuOpen}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {menuAccessories.map((item, index) => (
                  <MenuItem
                    key={`menu-${index}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    $color={item.color}
                  >
                    {item.icon}
                    {item.label}
                  </MenuItem>
                ))}
              </MenuContainer>
            </MenuWrapper>
          )}
        </AccessoriesContainer>
      </div>
    </div>
  );
};

// Main component interface
interface VerticalSplitProps {
  topView?: React.ReactNode;
  bottomView?: React.ReactNode;
  topViewOverlay?: React.ReactNode;
  bottomViewOverlay?: React.ReactNode;
  bgColor?: string;
  leadingAccessories?: SplitAccessory[];
  trailingAccessories?: SplitAccessory[];
  menuAccessories?: MenuAccessory[];
  menuItems?: MenuAccessory[];
  menuIcon?: React.ReactNode;
  menuColor?: string;
  children?: React.ReactNode;
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
  bgColor,
  leadingAccessories,
  trailingAccessories,
  menuAccessories,
  menuItems,
  menuIcon,
  menuColor,
  children,
}) => {
  const { theme } = useTheme();
  const effectiveBgColor = bgColor || theme.background;
  // State variables
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitY, setSplitY] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState(false);
  const mouseMoveRef = useRef<(e: MouseEvent) => void>();
  const mouseUpRef = useRef<() => void>();
  const touchMoveRef = useRef<(e: TouchEvent) => void>();
  const touchEndRef = useRef<() => void>();

  // Derive content from explicit props or children
  const childrenArray = React.Children.toArray(children);
  const effectiveTop = topView ?? childrenArray[0] ?? null;
  const effectiveBottom = bottomView ?? childrenArray[1] ?? null;
  const effectiveMenu = menuItems ?? menuAccessories;

  // Initialize container height and split position
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && rect.height > 0) {
        setContainerHeight(rect.height);
        
        // Only initialize split position once
        if (!isInitialized) {
          setSplitY(rect.height / 2);
          setIsInitialized(true);
        }
      }
    };

    // Initial measurement
    updateDimensions();

    // Use ResizeObserver for more accurate dimension tracking
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        if (height > 0) {
          setContainerHeight(height);
          
          // Adjust split position if it's out of bounds after resize
          setSplitY(prevSplitY => {
            const minSplit = DIVIDER_HEIGHT / 2;
            const maxSplit = height - DIVIDER_HEIGHT / 2;
            return Math.max(minSplit, Math.min(maxSplit, prevSplitY));
          });
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Fallback for older browsers
    const handleResize = () => {
      updateDimensions();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isInitialized]);

  useEffect(() => {
    return () => {
      if (mouseMoveRef.current) {
        document.removeEventListener('mousemove', mouseMoveRef.current);
      }
      if (mouseUpRef.current) {
        document.removeEventListener('mouseup', mouseUpRef.current);
      }
      if (touchMoveRef.current) {
        document.removeEventListener('touchmove', touchMoveRef.current as any);
      }
      if (touchEndRef.current) {
        document.removeEventListener('touchend', touchEndRef.current as any);
      }
    };
  }, [isDragging]);

  const snapToEdge = () => {
    if (!containerRef.current) return;
    const height = containerRef.current.getBoundingClientRect().height;
    if (splitY < SNAP_THRESHOLD) {
      setSplitY(DIVIDER_HEIGHT / 2);
    } else if (splitY > height - SNAP_THRESHOLD) {
      setSplitY(height - DIVIDER_HEIGHT / 2);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set grabbing cursor on the entire document during drag
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    const startY = e.clientY;
    const startSplitY = splitY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      let relativeSplitY = startSplitY + (moveEvent.clientY - startY);
      
      // Calculate resistance based on position
      let resistanceFactor = 1;
      
      // Edge resistance only
      if (relativeSplitY < EDGE_RESISTANCE_THRESHOLD) {
        const edgeProgress = relativeSplitY / EDGE_RESISTANCE_THRESHOLD;
        resistanceFactor = EDGE_RESISTANCE_FACTOR + (1 - EDGE_RESISTANCE_FACTOR) * edgeProgress;
        
        // Trigger haptic feedback on overscroll
        if (relativeSplitY < 0) {
          vibrate(Math.min(1, Math.abs(relativeSplitY) / HAPTIC_THRESHOLD));
        }
      } else if (relativeSplitY > containerRect.height - EDGE_RESISTANCE_THRESHOLD) {
        const edgeProgress = (containerRect.height - relativeSplitY) / EDGE_RESISTANCE_THRESHOLD;
        resistanceFactor = EDGE_RESISTANCE_FACTOR + (1 - EDGE_RESISTANCE_FACTOR) * edgeProgress;
        
        // Trigger haptic feedback on overscroll
        if (relativeSplitY > containerRect.height) {
          vibrate(Math.min(1, (relativeSplitY - containerRect.height) / HAPTIC_THRESHOLD));
        }
      }
      
      // Apply resistance to movement
      relativeSplitY = startSplitY + (moveEvent.clientY - startY) * resistanceFactor;
      
      // Allow full minimization while keeping divider within bounds
      const minSplit = DIVIDER_HEIGHT / 2;
      const maxSplit = containerRect.height - DIVIDER_HEIGHT / 2;
      const newSplitY = Math.max(minSplit, Math.min(maxSplit, relativeSplitY));
      
      setSplitY(newSplitY);
    };

    const onMouseUp = () => {
      // Reset cursor styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      snapToEdge();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setIsDragging(false);
      mouseMoveRef.current = undefined;
      mouseUpRef.current = undefined;
    };

    mouseMoveRef.current = onMouseMove;
    mouseUpRef.current = onMouseUp;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    setIsDragging(true);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startY = e.touches[0].clientY;
    const startSplitY = splitY;

    const onTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      if (!containerRef.current || !moveEvent.touches[0]) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      let relativeSplitY = startSplitY + (moveEvent.touches[0].clientY - startY);
      
      // Calculate resistance based on position
      let resistanceFactor = 1;
      
      // Edge resistance only
      if (relativeSplitY < EDGE_RESISTANCE_THRESHOLD) {
        const edgeProgress = relativeSplitY / EDGE_RESISTANCE_THRESHOLD;
        resistanceFactor = EDGE_RESISTANCE_FACTOR + (1 - EDGE_RESISTANCE_FACTOR) * edgeProgress;
        
        // Trigger haptic feedback on overscroll
        if (relativeSplitY < 0) {
          vibrate(Math.min(1, Math.abs(relativeSplitY) / HAPTIC_THRESHOLD));
        }
      } else if (relativeSplitY > containerRect.height - EDGE_RESISTANCE_THRESHOLD) {
        const edgeProgress = (containerRect.height - relativeSplitY) / EDGE_RESISTANCE_THRESHOLD;
        resistanceFactor = EDGE_RESISTANCE_FACTOR + (1 - EDGE_RESISTANCE_FACTOR) * edgeProgress;
        
        // Trigger haptic feedback on overscroll
        if (relativeSplitY > containerRect.height) {
          vibrate(Math.min(1, (relativeSplitY - containerRect.height) / HAPTIC_THRESHOLD));
        }
      }
      
      // Apply resistance to movement
      relativeSplitY = startSplitY + (moveEvent.touches[0].clientY - startY) * resistanceFactor;
      
      // Allow full minimization while keeping divider within bounds
      const minSplit = DIVIDER_HEIGHT / 2;
      const maxSplit = containerRect.height - DIVIDER_HEIGHT / 2;
      const newSplitY = Math.max(minSplit, Math.min(maxSplit, relativeSplitY));
      
      setSplitY(newSplitY);
    };

    const onTouchEnd = () => {
      snapToEdge();
      document.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('touchend', onTouchEnd as any);
      setIsDragging(false);
      touchMoveRef.current = undefined;
      touchEndRef.current = undefined;
    };

    touchMoveRef.current = onTouchMove;
    touchEndRef.current = onTouchEnd;

    document.addEventListener('touchmove', onTouchMove as any, { passive: false });
    document.addEventListener('touchend', onTouchEnd as any);
    setIsDragging(true);
  };

  // Calculate panel heights and scales
  const topHeight = Math.max(0, splitY - DIVIDER_HEIGHT / 2);
  const bottomHeight = Math.max(0, containerHeight - splitY - DIVIDER_HEIGHT / 2);
  const bottomTop = splitY + DIVIDER_HEIGHT / 2;

  // Calculate scale factors for minimizing effect
  const topScale = topHeight < MINIMIZE_SCALE_THRESHOLD 
    ? getPanelScale(topHeight, MINIMIZE_SCALE_THRESHOLD) 
    : 1;
  const bottomScale = bottomHeight < MINIMIZE_SCALE_THRESHOLD 
    ? getPanelScale(bottomHeight, MINIMIZE_SCALE_THRESHOLD) 
    : 1;

  // Don't render panels until we have proper dimensions and initialization
  if (!isInitialized || containerHeight === 0) {
    return <Container ref={containerRef} $backgroundColor={effectiveBgColor} />;
  }

  return (
    <Container ref={containerRef} $backgroundColor={effectiveBgColor}>
      {/* Top Panel - render even at 0 height */}
      <TopPanel
        $height={topHeight}
        $backgroundColor={effectiveBgColor}
        $scale={topScale}
      >
        <ContentContainer $position="top">
          {effectiveTop}
          {topViewOverlay}
        </ContentContainer>
      </TopPanel>
      
      {/* Divider with accessories */}
      <Divider
        top={splitY - DIVIDER_HEIGHT / 2}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        leadingAccessories={leadingAccessories}
        trailingAccessories={trailingAccessories}
        menuAccessories={effectiveMenu}
        menuIcon={menuIcon}
        menuColor={menuColor}
      />
      
      {/* Bottom Panel - render even at 0 height */}
      <BottomPanel
        $height={bottomHeight}
        $backgroundColor={effectiveBgColor}
        $top={bottomTop}
        $scale={bottomScale}
      >
        <ContentContainer $position="bottom">
          {bottomViewOverlay ? bottomViewOverlay : effectiveBottom}
        </ContentContainer>
      </BottomPanel>
      {topHeight === 0 && (
        <RestoreButton $position="top" onClick={() => setSplitY(containerHeight / 2)}>
          ⬇️
        </RestoreButton>
      )}
      {bottomHeight === 0 && (
        <RestoreButton $position="bottom" onClick={() => setSplitY(containerHeight / 2)}>
          ⬆️
        </RestoreButton>
      )}
    </Container>
  );
};

export default VerticalSplit;
