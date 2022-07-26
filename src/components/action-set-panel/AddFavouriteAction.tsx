import React from 'react';
import { ActionSet } from '../../typings';
import StarIcon from '@material-ui/icons/Star';
// import { useCurrentStoryData } from '../../hooks/use-current-story-data';
import {
  capitalize,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from '@material-ui/core';
import { addFavouriteAction } from '../../api/client/add-favourite-action';
import { useAnchorEl } from '../../hooks/use-anchor-el';
import {
  DialogTitle,
  Button,
  DialogActions,
  Popover,
  DialogContent,
} from '@material-ui/core';
import { useCurrentStoryData } from '../../hooks/use-current-story-data';
import { useSnackbar } from '../../hooks/use-snackbar';

export interface AddFavouriteActionProps {
  item: ActionSet;
}

const AddFavouriteAction: React.FC<AddFavouriteActionProps> = (props) => {
  const { item } = props;

  const { anchorEl, setAnchorEl, clearAnchorEl } = useAnchorEl();

  const [input, setInput] = React.useState<string>('*');

  const [radioValue, setRadioValue] = React.useState('*');

  const data = useCurrentStoryData();
  const { openSnackbar } = useSnackbar();

  const { parent = 'parent' } = data || {};

  const onAddToFavourite = React.useCallback(async () => {
    item.visibleTo = input;
    clearAnchorEl();
    try {
      await addFavouriteAction(item);
      openSnackbar(
        // prettier-ignore
        `Successfully added action to favourites`,
        { autoHideDuration: 5000 },
      );
    } catch (error) {
      openSnackbar(
        // prettier-ignore
        `An error has occurred:\n ${(error as any).message}`,
        { autoHideDuration: 5000, variant: 'error' },
      );
    }
  }, [clearAnchorEl, input, item, openSnackbar]);

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
                  label={capitalize(parent) + ' Stories'}
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
