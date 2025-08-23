import { css } from 'styled-components';

// Shared glass morphism style for translucent cards and panels
export const glassStyle = css`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;
