import { render } from '@testing-library/react';
import EmojiGridMapper from '../EmojiGridMapper';

jest.mock('@vfx-js/core', () => ({ VFX: jest.fn() }));
jest.mock('gsap/Draggable', () => ({ Draggable: { create: jest.fn(() => [null]) } }));
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    set: jest.fn(),
    registerPlugin: jest.fn()
  }
}));

it('renders without crashing', () => {
  expect(() => render(<EmojiGridMapper />)).not.toThrow();
});
