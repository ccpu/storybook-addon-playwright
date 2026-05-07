import type { ActionMenuItemBase } from './ActionMenuItem';
import { makeStyles, Menu } from '@material-ui/core';
import React, { memo, useCallback, useState } from 'react';
import { useActionSetStoreState } from '../../store/index';
import { ActionMenuItem } from './ActionMenuItem';
import { getMenu } from './utils/index';

const useStyles = makeStyles(
  () => {
    return {
      menu: {
        minWidth: 100,
      },
    };
  },
  { name: 'ActionMenu' },
);

export interface ActionMenuProps {
  onChange: (actionKey: string) => void;
  anchorEl: null | Element;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = memo((props) => {
  const { onChange, onClose, anchorEl } = props;

  const state = useActionSetStoreState();

  const [actionItems, setActionItems] = useState<ActionMenuItemBase[]>([]);

  const classes = useStyles();

  React.useEffect(() => {
    if (!state.actionSchema) return undefined;
    const actionList = getMenu(state.actionSchema);
    setActionItems(actionList);
  }, [state.actionSchema]);

  const handleChange = useCallback(
    (key: string) => {
      onChange(key);
    },
    [onChange],
  );

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={onClose}
      className={classes.menu}
    >
      {actionItems.map((action) => (
        <ActionMenuItem
          key={action.name}
          name={action.name}
          label={action.label}
          onChange={handleChange}
        >
          Profile
        </ActionMenuItem>
      ))}
    </Menu>
  );
});

ActionMenu.displayName = 'ActionMenu';

export { ActionMenu };
