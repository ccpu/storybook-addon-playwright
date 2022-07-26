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
import { getFavouriteActions } from '../../api/client/get-favourite-actions';
import { FavouriteActionSet } from '../../typings';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { useActionDispatchContext } from '../../store';
import { nanoid } from 'nanoid';
import { deleteFavouriteAction } from '../../api/client/delete-favourite-action';
import { useCurrentStoryData } from '../../hooks/use-current-story-data';
import { useAsyncApiCall } from '../../hooks/use-async-api-call';
import { saveActionSet as saveActionSetClient } from '../../api/client/save-action-set';
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
        id: 'Kj6iSI1D3BIF1yX_BLgxF',
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

  const { makeCall: saveActionSet } = useAsyncApiCall(
    saveActionSetClient,
    false,
  );

  const storyData = useCurrentStoryData();

  const { id: storyId } = storyData || {};

  const classes = useStyles();

  const dispatch = useActionDispatchContext();

  const loadActions = React.useCallback(() => {
    if (anchorEl) {
      getFavouriteActions().then((result) => {
        const actions = [
          ...defaults,
          ...filterFavouriteActions(result, storyId),
        ];

        setActionSets(actions);
      });
    }
  }, [anchorEl, storyId]);

  const onAddQuickAction = async (item: FavouriteActionSet) => {
    const id = nanoid(12);
    const newActionSet: FavouriteActionSet = {
      ...item,
      id,
      visibleTo: undefined,
    };

    const result = await saveActionSet({
      actionSet: newActionSet,
      fileName: storyData.parameters.fileName as string,
      storyId,
    });

    if (!(result instanceof Error))
      dispatch({
        actionSet: newActionSet,
        new: false,
        selected: true,
        storyId,
        type: 'addActionSet',
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
