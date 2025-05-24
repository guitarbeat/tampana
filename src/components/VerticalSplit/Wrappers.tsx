import React from 'react';
import styled from 'styled-components';

// Wrapper components for top and bottom panels
// These match the SwiftUI TopWrapper and BottomWrapper functionality

interface WrapperProps {
  minimise: number;
  overscroll: number;
  isFull: boolean;
  isShowingAccessories: boolean;
  bgColor: string;
  content: React.ReactNode;
  overlay: React.ReactNode;
  style?: React.CSSProperties; // Add style prop
}

const getCornerRadius = (isFull: boolean, overscroll: number) => {
  // 22px when not full, 44px+overscroll when full (mimic SwiftUI)
  return isFull ? Math.max(44 + Math.abs(overscroll) * 0.5, 22) : 22;
};

// Styled components for the wrappers
const WrapperContainer = styled.div<{
  $minimise: number;
  $overscroll: number;
  $isFull: boolean;
  $isShowingAccessories: boolean;
  $bgColor: string;
  $isTop: boolean;
  $cornerRadius: number;
}>`
  position: absolute;
  left: 0;
  right: 0;
  ${props => props.$isTop ? 'top: 0;' : 'bottom: 0;'}
  background: ${props => props.$bgColor};
  border-radius: ${props => props.$cornerRadius}px;
  overflow: hidden;
  z-index: ${props => props.$isFull ? 20 : 10};
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.18);
  transform:
    scale(${props => 1 - (1 - props.$minimise) * 0.12})
    translateY(${props => props.$overscroll}px);
  filter: ${props => props.$minimise > 0 ? `blur(${props.$minimise * 8}px)` : 'none'};
  transition:
    border-radius 0.35s cubic-bezier(0.4,0.2,0.2,1),
    box-shadow 0.35s cubic-bezier(0.4,0.2,0.2,1),
    transform 0.35s cubic-bezier(0.4,0.2,0.2,1),
    filter 0.35s cubic-bezier(0.4,0.2,0.2,1),
    background 0.25s;
  pointer-events: auto;
  touch-action: auto;
  will-change: transform, filter;
`;

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  mask-image: radial-gradient(circle at 50% 50%, #000 100%, transparent 100%);
  position: relative;
  z-index: 1;
  pointer-events: auto;
`;

const OverlayContainer = styled.div<{ $minimise: number }>`
  position: absolute;
  left: 0;
  right: 0;
  ${props => props.$minimise < 0.5 ? 'top: 8px;' : 'top: 16px;'}
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30;
  opacity: ${props => 1 - props.$minimise};
  filter: blur(${props => props.$minimise * 8}px);
  pointer-events: ${props => props.$minimise === 0 ? 'auto' : 'none'};
  transition: opacity 0.3s, filter 0.3s;
  will-change: opacity, filter;
`;

export const TopWrapper: React.FC<WrapperProps> = ({
  minimise,
  overscroll,
  isFull,
  isShowingAccessories,
  bgColor,
  content,
  overlay,
  style
}) => {
  const cornerRadius = getCornerRadius(isFull, overscroll < 0 ? overscroll : 0);
  return (
    <WrapperContainer
      $minimise={minimise}
      $overscroll={overscroll < 0 ? overscroll : 0}
      $isFull={isFull}
      $isShowingAccessories={isShowingAccessories}
      $bgColor={bgColor}
      $isTop={true}
      $cornerRadius={cornerRadius}
      style={style}
    >
      <ContentContainer>
        {content}
      </ContentContainer>
      <OverlayContainer $minimise={minimise}>
        {overlay}
      </OverlayContainer>
    </WrapperContainer>
  );
};

export const BottomWrapper: React.FC<WrapperProps> = ({
  minimise,
  overscroll,
  isFull,
  isShowingAccessories,
  bgColor,
  content,
  overlay,
  style
}) => {
  const cornerRadius = getCornerRadius(isFull, overscroll > 0 ? overscroll : 0);
  return (
    <WrapperContainer
      $minimise={minimise}
      $overscroll={overscroll > 0 ? overscroll : 0}
      $isFull={isFull}
      $isShowingAccessories={isShowingAccessories}
      $bgColor={bgColor}
      $isTop={false}
      $cornerRadius={cornerRadius}
      style={style}
    >
      <ContentContainer>
        {content}
      </ContentContainer>
      <OverlayContainer $minimise={minimise}>
        {overlay}
      </OverlayContainer>
    </WrapperContainer>
  );
};
