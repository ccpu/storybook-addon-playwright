import type { FavouriteActionSet } from '../../../../typings';

import {
  Button,
  capitalize,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Popover,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { IconButton } from '@storybook/components';
import { StarIcon } from '@storybook/icons';
import React from 'react';
import { trpcClient } from '../../../../api/trpc/client';
import { useAnchorEl } from '../../../../hooks/use-anchor-el';
import { useCurrentStoryData } from '../../../../hooks/use-current-story-data';
import { toast } from '../../../../utils/toast';

export interface AddFavouriteActionProps {
  item: FavouriteActionSet;
}

const AddFavouriteAction: React.FC<AddFavouriteActionProps> = (props) => {
  const { item } = props;

  const { anchorEl, setAnchorEl, clearAnchorEl } = useAnchorEl();

  const [input, setInput] = React.useState<string>('*');

  const [radioValue, setRadioValue] = React.useState('*');

  const data = useCurrentStoryData();

  const { mutateAsync: addFavouriteAction } =
    trpcClient.favouriteActions.addFavouriteAction.useMutation();

  const { parent = 'parent' } = data || {};

  const onAddToFavourite = React.useCallback(async () => {
    item.visibleTo = input;
    clearAnchorEl();
    try {
      await addFavouriteAction(item);
      toast.success(
        // prettier-ignore
        `Successfully added action to favourites`,
        { duration: 5000 },
      );
    } catch (error) {
      toast.error(
        // prettier-ignore
        `An error has occurred:\n ${(error as { message?: string }).message || 'Unknown error'}`,
        { duration: 5000 },
      );
    }
  }, [addFavouriteAction, clearAnchorEl, input, item]);

  const handleRadioChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    v,
  ) => {
    setInput(v);
    setRadioValue(v);
  };

  return (
    <>
      <IconButton
        className="add-favourite"
        onClick={setAnchorEl}
        size="small"
        title="Add To Favourite"
      >
        <StarIcon />
      </IconButton>
      {anchorEl && (
        <Popover anchorEl={anchorEl} open={true} onClose={clearAnchorEl}>
          <DialogTitle>Define witch story(s) can use this action:</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup row value={radioValue} onChange={handleRadioChange}>
                <FormControlLabel
                  value="*"
                  control={<Radio size="small" />}
                  label="All Stories"
                />
                <FormControlLabel
                  value={parent}
                  control={<Radio size="small" />}
                  label={`${capitalize(parent)} Stories`}
                />
              </RadioGroup>
            </FormControl>
            <div>
              <TextField
                value={input}
                onChange={(e) => setInput(e.target.value)}
                helperText="Or enter regex expression"
                fullWidth
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onAddToFavourite}>Save</Button>
          </DialogActions>
        </Popover>
      )}
    </>
  );
};

AddFavouriteAction.displayName = 'AddFavouriteAction';

export { AddFavouriteAction };
