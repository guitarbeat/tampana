import React from 'react';
import styled from 'styled-components';

// Interfaces
interface WrapperProps {
  height: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  containerHeight: number;
  isTop?: boolean;
}

interface WrapperContainerProps {
  $height: number;
  $scale: number;
  $isTop: boolean;
}

// Styled components
const WrapperContainer = styled.div<WrapperContainerProps>`
  position: absolute;
  left: 0;
  right: 0;
  ${props => props.$isTop ? 'top: 0;' : props.style?.top !== undefined ? `top: ${props.style.top}px;` : ''}
  height: ${props => props.$height}px;
  background: ${props => props.style?.backgroundColor || '#ffffff'};
  border-radius: 32px;
  overflow: hidden;
  transition: height 0.15s cubic-bezier(0.4,0.2,0.2,1);
  transform-origin: ${props => props.$isTop ? 'top' : 'bottom'};
  transform: scale(1);
  box-sizing: border-box;
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

const PanelWrapper: React.FC<WrapperProps & { isTop: boolean }> = ({
  height,
  style,
  children,
  containerHeight,
  isTop
}) => {
  const scale = 1;
  return (
    <WrapperContainer
      $height={height}
      $scale={scale}
      $isTop={isTop}
      style={style}
    >
      <ContentContainer>
        {children}
      </ContentContainer>
    </WrapperContainer>
  );
};

export const TopWrapper: React.FC<WrapperProps> = (props) => (
  <PanelWrapper {...props} isTop={true} />
);

export const BottomWrapper: React.FC<WrapperProps> = (props) => (
  <PanelWrapper {...props} isTop={false} />
);
