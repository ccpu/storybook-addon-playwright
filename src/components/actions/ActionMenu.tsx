import React, { memo, SFC, useState, useCallback } from 'react';
import { Menu, makeStyles } from '@material-ui/core';
import { ActionMenuItem, ActionMenuItemBase } from './ActionMenuItem';
import { useActionContext } from '../../store/actions';
import { getMenu } from './utils';

const useStyles = makeStyles(
  () => {
    return {
      menu: {
        minWidth: 100,
      },
      root: {
        marginTop: 10,
        textAlign: 'center',
      },
    };
  },
  { name: 'ActionMenu' },
);

export interface ActionMenuProps {
  onChange: (actionKey: string) => void;
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

const ActionMenu: SFC<ActionMenuProps> = memo((props) => {
  const { onChange, onClose, anchorEl } = props;

  const state = useActionContext();

  const [actionItems, setActionItems] = useState<ActionMenuItemBase[]>([]);
  console.log(actionItems);
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
    <div className={classes.root}>
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
    </div>
  );
});

ActionMenu.displayName = 'ActionMenu';

export { ActionMenu };
