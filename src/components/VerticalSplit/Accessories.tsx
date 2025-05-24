import React from 'react';
import styled from 'styled-components';

// Interface for the SplitAccessory component props
export interface SplitAccessory {
  id: string;
  title?: string; // made optional for compatibility
  icon: React.ReactNode;
  color?: string;
  action: () => void;
}

export interface MenuAccessory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color?: string;
  action: () => void;
}

export function createSplitAccessory(
  id: string,
  title: string,
  icon: React.ReactNode,
  color: string = '#fff',
  action: () => void
): SplitAccessory {
  return { id, title, icon, color, action };
}

export function createMenuAccessory(
  id: string,
  title: string,
  icon: React.ReactNode,
  color: string = '#fff',
  action: () => void
): MenuAccessory {
  return { id, title, icon, color, action };
}

const AccessoryButton = styled.button`
  background: none;
  border: none;
  color: #333;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const AccessoryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LeadingAccessories: React.FC<{
  accessories: SplitAccessory[];
}> = ({ accessories }) => {
  if (accessories.length === 0) return null;
  
  return (
    <AccessoryContainer>
      {accessories.map(accessory => (
        <AccessoryButton 
          key={accessory.id}
          onClick={accessory.action}
          aria-label={accessory.id}
        >
          {accessory.icon}
        </AccessoryButton>
      ))}
    </AccessoryContainer>
  );
};

export const TrailingAccessories: React.FC<{
  accessories: SplitAccessory[];
}> = ({ accessories }) => {
  if (accessories.length === 0) return null;
  
  return (
    <AccessoryContainer>
      {accessories.map(accessory => (
        <AccessoryButton 
          key={accessory.id}
          onClick={accessory.action}
          aria-label={accessory.id}
        >
          {accessory.icon}
        </AccessoryButton>
      ))}
    </AccessoryContainer>
  );
};

const MenuButton = styled(AccessoryButton)`
  position: relative;
`;

const MenuContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 100;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const MenuItemText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

export const MenuAccessories: React.FC<{
  accessories: MenuAccessory[];
  menuSymbol?: React.ReactNode;
}> = ({ accessories, menuSymbol }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  if (accessories.length === 0) return null;
  
  return (
    <div>
      <MenuButton 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        {menuSymbol}
      </MenuButton>
      
      <MenuContainer isOpen={isOpen}>
        {accessories.map(accessory => (
          <MenuItem 
            key={accessory.id}
            onClick={() => {
              accessory.action();
              setIsOpen(false);
            }}
          >
            {accessory.icon}
            <MenuItemText>{accessory.title}</MenuItemText>
          </MenuItem>
        ))}
      </MenuContainer>
    </div>
  );
};
