import { render, act } from '@testing-library/react';
import EmojiGridMapper from '../EmojiGridMapper';

jest.mock('@vfx-js/core', () => ({
  VFX: jest.fn().mockImplementation(() => ({ add: jest.fn(), remove: jest.fn() }))
}));
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    set: jest.fn(),
    registerPlugin: jest.fn()
  }
}));
jest.mock('gsap/Draggable', () => ({
  Draggable: { create: jest.fn(() => [{ kill: jest.fn() }]) }
}));

import { Draggable } from 'gsap/Draggable';

const createMock = Draggable.create as jest.Mock;

test('renders without crashing', () => {
  expect(() => render(<EmojiGridMapper />)).not.toThrow();
});

test('onEmojiSelect includes timestamp', () => {
  const onEmojiSelect = jest.fn();
  let opts: any;
  createMock.mockImplementationOnce((_el, options) => {
    opts = options;
    return [{ kill: jest.fn() }];
  });

  render(<EmojiGridMapper onEmojiSelect={onEmojiSelect} />);

  act(() => {
    opts.onDrag.call({ x: 0, y: 0 });
  });

  expect(onEmojiSelect).toHaveBeenCalled();
  const arg = onEmojiSelect.mock.calls[0][0];
  expect(arg.timestamp).toBeDefined();
});
