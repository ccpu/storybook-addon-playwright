import type { FavouriteActionSet } from '../../../../typings';
import { capitalize, makeStyles } from '@material-ui/core';
import { IconButton, ListItem, WithTooltip } from '@storybook/components';
import { TrashIcon } from '@storybook/icons';
import { nanoid } from 'nanoid';
import React from 'react';
import { trpcClient } from '../../../../api/trpc/client';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { addActionSet as addActionSetToStore } from '../../store/actions';
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
  children?: React.ReactNode;
  getContainerHeight?: () => number | undefined;
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
  const { children, getContainerHeight } = props;

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
    refetchFavouriteActions().then(({ data: result }) => {
      const actions = [
        ...defaults,
        ...filterFavouriteActions(result || [], storyId ?? ''),
      ];

      setActionSets(actions);
    });
  }, [refetchFavouriteActions, storyId]);

  const onAddQuickAction = async (item: FavouriteActionSet) => {
    if (!storyData || !storyId) return;

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
    <WithTooltip
      closeOnOutsideClick
      placement="bottom-start"
      trigger="click"
      tooltip={({ onHide }) => {
        const containerHeight = getContainerHeight?.();
        return (
          <div
            className={classes.menu}
            style={{
              maxHeight: containerHeight ? `${containerHeight - 50}px` : '50vh',
              overflowY: 'auto',
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {actionSets.map((item) => {
              return (
                <ListItem
                  key={item.id}
                  title={capitalize(item.title)}
                  right={
                    <IconButton
                      disabled={item.id.endsWith('--default')}
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteAction(item.id);
                        onHide();
                      }}
                    >
                      <TrashIcon fontSize="small" />
                    </IconButton>
                  }
                  onClick={async () => {
                    await onAddQuickAction(item);
                    onHide();
                  }}
                />
              );
            })}
          </div>
        );
      }}
    >
      {children}
    </WithTooltip>
  );
};

FavouriteActions.displayName = 'FavouriteActions';

export { FavouriteActions };
