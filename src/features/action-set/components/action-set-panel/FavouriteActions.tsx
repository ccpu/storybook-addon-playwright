import React from 'react';
import {
  MenuList,
  makeStyles,
  ListItemText,
  MenuItem,
  Menu,
  IconButton,
  capitalize,
} from '@material-ui/core';
import { trpcClient } from '../../../../api';
import { FavouriteActionSet } from '../../../../typings';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { addActionSet as addActionSetToStore } from '../../../../store';
import { nanoid } from 'nanoid';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { filterFavouriteActions } from './utils/filter-favourite-actions';

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

export interface FavouriteActionsProps {
  anchorEl?: null | HTMLElement;
  onClose: () => void;
}

const defaults: FavouriteActionSet[] = [
  {
    actions: [
      {
        id: 'Kj6iSI1D3BIF1yX',
        name: 'takeScreenshot',
      },
    ],
    id: '1--default',
    title: 'Take screenshot',
    visibleTo: '*',
  },
  {
    actions: [
      {
        id: 'zjgHFLzuMbXG',
        name: 'takeScreenshotAll',
      },
    ],
    id: '2--default',
    title: 'Take screenshot of all actions',
    visibleTo: '*',
  },
];

const FavouriteActions: React.FC<FavouriteActionsProps> = (props) => {
  const { anchorEl, onClose } = props;

  const [actionSets, setActionSets] =
    React.useState<FavouriteActionSet[]>(defaults);

  const { mutateAsync: saveActionSet } =
    trpcClient.actionSet.saveActionSet.useMutation();

  const { mutateAsync: deleteFavouriteAction } =
    trpcClient.favouriteActions.deleteFavouriteAction.useMutation();

  const { refetch: refetchFavouriteActions } =
    trpcClient.favouriteActions.getFavouriteActions.useQuery(undefined, {
      enabled: false,
    });

  const storyData = useCurrentStoryData();

  const { id: storyId } = storyData || {};

  const classes = useStyles();

  const loadActions = React.useCallback(() => {
    if (!anchorEl) return;
    refetchFavouriteActions().then(({ data: result }) => {
      const actions = [
        ...defaults,
        ...filterFavouriteActions(result || [], storyId),
      ];

      setActionSets(actions);
    });
  }, [anchorEl, refetchFavouriteActions, storyId]);

  const onAddQuickAction = async (item: FavouriteActionSet) => {
    const id = nanoid(12);
    const newActionSet: FavouriteActionSet = {
      ...item,
      id,
      visibleTo: undefined,
    };

    await saveActionSet({
      actionSet: newActionSet,
      filePath: storyData.filePath,
      storyId,
    });

    addActionSetToStore({
      actionSet: newActionSet,
      isNew: false,
      selected: true,
      storyId,
    });
  };

  const deleteAction = async (actionSetId: string) => {
    await deleteFavouriteAction({ actionSetId });
    loadActions();
  };

  React.useEffect(() => {
    loadActions();
  }, [loadActions]);

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
        className={classes.menu}
      >
        <MenuList dense>
          {anchorEl &&
            actionSets.map((item) => {
              return (
                <MenuItem
                  key={item.id}
                  value={item.id}
                  style={{ paddingBlock: 3 }}
                  onClick={async () => {
                    await onAddQuickAction(item);
                  }}
                >
                  <ListItemText>{capitalize(item.title)}</ListItemText>

                  <IconButton
                    disabled={item.id.endsWith('--default')}
                    style={{ marginLeft: 20, padding: 6 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAction(item.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </MenuItem>
              );
            })}
        </MenuList>
      </Menu>
    </>
  );
};

FavouriteActions.displayName = 'FavouriteActions';

export { FavouriteActions };
