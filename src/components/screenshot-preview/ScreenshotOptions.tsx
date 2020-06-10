import React, { SFC, useCallback } from 'react';
import { ScreenshotOptions as ScreenshotOptionsType } from '../../typings';
import { TextField, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        marginRight: theme.spacing(0.5),
        marginTop: theme.spacing(1),
        width: '25ch',
      },
      display: 'flex',
    },
  }),
);

export interface ScreenshotOptionsProps {
  onChange: (options: ScreenshotOptionsType) => void;
  options?: ScreenshotOptionsType;
}

const ScreenshotOptions: SFC<ScreenshotOptionsProps> = ({
  onChange,
  options = {},
}) => {
  const classes = useStyles();

  const isClip = useCallback(
    (name: string) => ['x', 'y', 'width', 'height'].indexOf(name) !== -1,
    [],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = event.target.name;
      const val = event.target.value;
      if (isClip(name)) {
        onChange({ ...options, clip: { ...options.clip, [name]: val } });
      } else {
        onChange({ ...options, [name]: val });
      }
    },
    [isClip, onChange, options],
  );

  const getValue = useCallback(
    (name: string) => {
      if (isClip(name)) {
        if (!options.clip) return '';
        return options.clip[name];
      }
      return options[name];
    },
    [isClip, options],
  );

  return (
    <div>
      <label>Screenshot Clip:</label>
      <form noValidate autoComplete="off" className={classes.root}>
        <TextField
          label="Width"
          value={getValue('width')}
          name="width"
          size="small"
          variant="outlined"
          onChange={handleChange}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Height"
          name="height"
          size="small"
          value={getValue('height')}
          variant="outlined"
          type="number"
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="X"
          name="x"
          value={getValue('x')}
          size="small"
          onChange={handleChange}
          variant="outlined"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="y"
          label="Y"
          size="small"
          value={getValue('y')}
          onChange={handleChange}
          variant="outlined"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    </div>
  );
};

ScreenshotOptions.displayName = 'ScreenshotOptions';

export { ScreenshotOptions };
