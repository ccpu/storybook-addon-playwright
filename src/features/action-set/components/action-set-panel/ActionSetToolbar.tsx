import { IconButton } from '@storybook/components';
import { LightningIcon, PlusIcon, RefreshIcon, StarIcon } from '@storybook/icons';
import React, { useCallback } from 'react';
import { DeleteConfirmationButton, Loader, Toolbar } from '../../../../components/common';
import { useActionSchemaLoader } from '../../../../hooks';
import { ActionMenu } from './ActionMenu';
import { FavouriteActions } from './FavouriteActions';

export interface ActionToolbarProps {
  onAddActionSet: () => void;
  onAddAction: (actionName: string) => void;
  onReset: () => void;
  onFavoriteActionsClick?: () => void;
  onDeleteSelectedActionSets: () => void;
  deleteDisabled?: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = (props) => {
  const {
    onAddActionSet,
    onAddAction,
    onReset,
    onFavoriteActionsClick,
    onDeleteSelectedActionSets,
    deleteDisabled,
  } = props;

  const { loading } = useActionSchemaLoader();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | Element>(null);

  const handleMenuOpen = useCallback((event: React.SyntheticEvent<Element, Event>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleMenuChange = useCallback(
    (actionName: string) => {
      onAddAction(actionName);
      setMenuAnchorEl(null);
    },
    [onAddAction],
  );

  return (
    <>
      <Loader open={loading} />
      <Toolbar border={['bottom']}>
        <div className="left">
          <span>Action Sets</span>
        </div>
        <div className="right">
          <FavouriteActions>
            <IconButton onClick={onFavoriteActionsClick} title="Favourite Actions">
              <StarIcon />
            </IconButton>
          </FavouriteActions>
          <IconButton onClick={onReset} title="Reset">
            <RefreshIcon />
          </IconButton>

          <DeleteConfirmationButton
            disabled={deleteDisabled}
            onDelete={onDeleteSelectedActionSets}
            IconButton={IconButton}
          />

          <IconButton onClick={handleMenuOpen} title="Add Quick Action">
            <LightningIcon />
          </IconButton>

          <IconButton onClick={onAddActionSet} title="Add Action Set">
            <PlusIcon />
          </IconButton>
        </div>
      </Toolbar>
      <ActionMenu
        onClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        onChange={handleMenuChange}
      />
    </>
  );
};

ActionToolbar.displayName = 'ActionToolbar';

export { ActionToolbar };
