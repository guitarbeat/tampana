import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #ccc;
  ${({ $fullScreen }) =>
    $fullScreen &&
    css`
      position: fixed;
      inset: 0;
      background: #0d1117;
      z-index: 9999;
    `}
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #4ecdc4;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 16px;
`;

const Message = styled.div`
  font-size: 0.9rem;
`;

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading…',
  fullScreen = true,
}) => (
  <Container $fullScreen={fullScreen}>
    <Spinner />
    <Message>{message}</Message>
  </Container>
);

export default LoadingScreen;
