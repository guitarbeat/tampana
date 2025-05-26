import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { scaleDownButtonStyle } from './utils';

// Constants
const DIVIDER_HEIGHT = 20;
const ACCESSORY_SIZE = 24;
const ACCESSORY_SPACING = 8;

// Types for accessories
interface SplitAccessory {
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface MenuAccessory {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

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

// Accessory button styles
const AccessoryButton = styled.button<{ $color?: string }>`
  width: ${ACCESSORY_SIZE}px;
  height: ${ACCESSORY_SIZE}px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$color || 'white'};
  transition: background 0.2s, transform 0.2s;
  padding: 0;
  margin: 0 ${ACCESSORY_SPACING / 2}px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: scale(0.9);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const AccessoriesContainer = styled.div`
  display: flex;
  align-items: center;
  z-index: 100;
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

// Panel styled components
const Panel = styled.div<{ $height: number; $backgroundColor: string }>`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: ${props => props.$height}px;
  background: ${props => props.$backgroundColor};
  border-radius: 32px;
  overflow: visible;
  box-sizing: border-box;
`;

const TopPanel = styled(Panel)`
  top: 0;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const BottomPanel = styled(Panel)<{ $top: number }>`
  top: ${props => props.$top}px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  position: relative;
  box-sizing: border-box;
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { display: none; } /* Chrome/Safari */
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
              <AccessoryButton 
                key={`leading-${index}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  accessory.onClick();
                }}
                $color={accessory.color}
              >
                {accessory.icon}
              </AccessoryButton>
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
            <AccessoryButton 
              key={`trailing-${index}`} 
              onClick={(e) => {
                e.stopPropagation();
                accessory.onClick();
              }}
              $color={accessory.color}
            >
              {accessory.icon}
            </AccessoryButton>
          ))}
          
          {/* Menu button if menu accessories exist */}
          {menuAccessories && menuAccessories.length > 0 && (
            <div ref={menuRef}>
              <MenuButton 
                onClick={toggleMenu}
                $color={menuColor}
              >
                {menuIcon || (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                )}
                
                {/* Menu dropdown */}
                <MenuContainer $isOpen={isMenuOpen}>
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
              </MenuButton>
            </div>
          )}
        </AccessoriesContainer>
      </div>
    </div>
  );
};

// Main component interface
interface VerticalSplitProps {
  topView: React.ReactNode;
  bottomView: React.ReactNode;
  topViewOverlay?: React.ReactNode;
  bottomViewOverlay?: React.ReactNode;
  bgColor?: string;
  leadingAccessories?: SplitAccessory[];
  trailingAccessories?: SplitAccessory[];
  menuAccessories?: MenuAccessory[];
  menuIcon?: React.ReactNode;
  menuColor?: string;
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
  bgColor = "#ffffff",
  leadingAccessories,
  trailingAccessories,
  menuAccessories,
  menuIcon,
  menuColor,
}) => {
  // State variables
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitY, setSplitY] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

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
            const minSplit = 50;
            const maxSplit = height - 50;
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
      const relativeSplitY = startSplitY + (moveEvent.clientY - startY);
      
      // Use dynamic constraints based on actual container height
      const minSplit = Math.max(50, containerRect.height * 0.1);
      const maxSplit = Math.min(containerRect.height - 50, containerRect.height * 0.9);
      const newSplitY = Math.max(minSplit, Math.min(maxSplit, relativeSplitY));
      
      setSplitY(newSplitY);
    };
    
    const onMouseUp = () => {
      // Reset cursor styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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
      const relativeSplitY = startSplitY + (moveEvent.touches[0].clientY - startY);
      
      // Use dynamic constraints based on actual container height
      const minSplit = Math.max(50, containerRect.height * 0.1);
      const maxSplit = Math.min(containerRect.height - 50, containerRect.height * 0.9);
      const newSplitY = Math.max(minSplit, Math.min(maxSplit, relativeSplitY));
      
      setSplitY(newSplitY);
    };
    
    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('touchend', onTouchEnd as any);
    };
    
    document.addEventListener('touchmove', onTouchMove as any, { passive: false });
    document.addEventListener('touchend', onTouchEnd as any);
  };

  // Calculate panel heights - simplified logic
  const topHeight = Math.max(0, splitY - DIVIDER_HEIGHT / 2);
  const bottomHeight = Math.max(0, containerHeight - splitY - DIVIDER_HEIGHT / 2);
  const bottomTop = splitY + DIVIDER_HEIGHT / 2;

  // Don't render panels until we have proper dimensions and initialization
  if (!isInitialized || containerHeight === 0) {
    return <Container ref={containerRef} style={{ backgroundColor: '#000' }} />;
  }

  return (
    <Container ref={containerRef} style={{ backgroundColor: '#000' }}>
      {/* Top Panel */}
      {topHeight > 10 && (
        <TopPanel $height={topHeight} $backgroundColor={bgColor}>
          <ContentContainer>
            {topView}
            {topViewOverlay}
          </ContentContainer>
        </TopPanel>
      )}
      
      {/* Divider with accessories */}
      <Divider
        top={splitY - DIVIDER_HEIGHT / 2}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        leadingAccessories={leadingAccessories}
        trailingAccessories={trailingAccessories}
        menuAccessories={menuAccessories}
        menuIcon={menuIcon}
        menuColor={menuColor}
      />
      
      {/* Bottom Panel */}
      {bottomHeight > 10 && (
        <BottomPanel 
          $height={bottomHeight} 
          $backgroundColor={bgColor}
          $top={bottomTop}
        >
          <ContentContainer>
            {bottomViewOverlay ? bottomViewOverlay : bottomView}
          </ContentContainer>
        </BottomPanel>
      )}
    </Container>
  );
};

export default VerticalSplit;
