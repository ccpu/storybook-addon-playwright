import React, { memo, useCallback, forwardRef, Ref } from 'react';
import { MenuItem } from '@material-ui/core';

export interface ActionMenuItemBase {
  label: string;
  name: string;
}

export interface ActionMenuItemProps extends ActionMenuItemBase {
  onChange: (key: string) => void;
}

const ActionMenuItem: React.FC<ActionMenuItemProps> = memo(
  forwardRef((props, ref: Ref<HTMLLIElement>) => {
    const { onChange, label, name } = props;

    const handleChange = useCallback(() => {
      onChange(name);
    }, [name, onChange]);

    return (
      <MenuItem ref={ref} onClick={handleChange}>
        {label}
      </MenuItem>
    );
  }),
);

ActionMenuItem.displayName = 'ActionMenuItem';

export { ActionMenuItem };
