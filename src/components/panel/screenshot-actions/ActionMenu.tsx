import React, {
  memo,
  SFC,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { Menu, makeStyles } from '@material-ui/core';
import { ActionMenuItem, ActionMenuItemBase } from './ActionMenuItem';
import { ActionContext } from '../../../store/actions';

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

  const { actionSchema } = useContext(ActionContext);

  const [actionItems, setActionItems] = useState<ActionMenuItemBase[]>([]);

  const classes = useStyles();

  useEffect(() => {
    if (!actionSchema) return undefined;
    const actionArr = Object.keys(actionSchema);
    const actionList = actionArr.map(
      (actionKey): ActionMenuItemBase => {
        const action = actionSchema[actionKey];
        if (action.labe) {
          return {
            label: action.labe,
            name: actionKey,
          };
        }
        return {
          label: actionKey,
          name: actionKey,
        };
      },
    );
    setActionItems(actionList);
  }, [actionSchema]);

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
