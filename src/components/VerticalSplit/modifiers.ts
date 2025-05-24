// Modifiers for VerticalSplit (React version of SwiftUI modifiers)
// Usage: let props = withLeadingAccessories({}, [...]);

import { SplitAccessory, MenuAccessory } from './Accessories';

export interface VerticalSplitProps {
  leadingAccessories?: SplitAccessory[];
  leadingCount?: number;
  trailingAccessories?: SplitAccessory[];
  trailingCount?: number;
  menuSymbol?: string;
  menuAccessories?: MenuAccessory[];
  shouldLog?: boolean;
  bgColor?: string;
  // ...other props as needed
}

export function withLeadingAccessories(
  props: VerticalSplitProps,
  accessories: SplitAccessory[]
): VerticalSplitProps {
  return {
    ...props,
    leadingAccessories: accessories,
    leadingCount: accessories.length,
  };
}

export function withTrailingAccessories(
  props: VerticalSplitProps,
  accessories: SplitAccessory[],
  menuAccessories: MenuAccessory[] = []
): VerticalSplitProps {
  return {
    ...props,
    trailingAccessories: accessories,
    trailingCount: accessories.length + (menuAccessories.length > 0 ? 1 : 0),
  };
}

export function withMenuAccessories(
  props: VerticalSplitProps,
  menuSymbol: string = 'plus.circle.fill',
  accessories: MenuAccessory[] = []
): VerticalSplitProps {
  return {
    ...props,
    menuSymbol,
    menuAccessories: accessories,
    trailingCount: (props.trailingAccessories?.length || 0) + (accessories.length > 0 ? 1 : 0),
  };
}

export function withDebug(
  props: VerticalSplitProps,
  isEnabled: boolean = true
): VerticalSplitProps {
  return {
    ...props,
    shouldLog: isEnabled,
  };
}

export function withBackgroundColor(
  props: VerticalSplitProps,
  color: string
): VerticalSplitProps {
  return {
    ...props,
    bgColor: color,
    // Optionally set textColor if you want
    // textColor: ...
  };
} 