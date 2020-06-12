import React, { SFC, useCallback, useState, useRef } from 'react';
import { ScreenshotOptions as ScreenshotOptionsType } from '../../typings';
import {
  TextField,
  makeStyles,
  createStyles,
  Button,
  Divider,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Typography,
  IconButton,
} from '@material-ui/core';
import HelpOutlineSharpIcon from '@material-ui/icons/HelpOutlineSharp';
import useThrottleFn from 'react-use/lib/useThrottleFn';
import RestoreIcon from '@material-ui/icons/Restore';

const useStyles = makeStyles((theme) =>
  createStyles({
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: 2,
      paddingTop: 2,
    },
    content: {
      marginBottom: 20,
      marginTop: 10,
    },
    controlLabel: {
      alignItems: 'center',
      display: 'flex',
    },
    form: {
      '& > *': {
        marginRight: theme.spacing(0.5),
        marginTop: theme.spacing(1),
        width: '25ch',
      },
      display: 'flex',
    },
    helpIcon: {
      marginLeft: 4,
      width: 15,
    },
    label: {
      alignItems: 'center',
      display: 'flex',
      marginBottom: 2,
    },
    labelWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    root: {
      margin: 10,
      marginBottom: 0,
    },
    title: {
      fontSize: 20,
      paddingBottom: 10,
    },
  }),
);

export interface ScreenshotOptionsProps {
  onChange: (screenshotOptions: ScreenshotOptionsType) => void;
  options?: ScreenshotOptionsType;
}

interface Clip {
  width: number;
  height: number;
  x: number;
  y: number;
}

const ScreenshotOptions: SFC<ScreenshotOptionsProps> = ({
  onChange,
  options = {},
}) => {
  const classes = useStyles();

  const requiredField = useRef<{ [key: string]: boolean }>({});
  const autoSetPropName = useRef<string>();

  const [screenshotOptions, setScreenshotOptions] = useState<
    ScreenshotOptionsType
  >(options);

  const isClipProp = useCallback(
    (name: string) => ['x', 'y', 'width', 'height'].indexOf(name) !== -1,
    [],
  );

  const isNumeric = useCallback(
    (name: string) =>
      ['x', 'y', 'width', 'height', 'quality'].indexOf(name) !== -1,
    [],
  );

  const setClipProps = useCallback(
    (clip: Clip) => {
      if (Object.keys(clip).length) {
        requiredField.current = {
          height: !(clip.height > 0),
          width: !(clip.width > 0),
          x: clip.x === undefined,
          y: clip.y === undefined,
        };
        screenshotOptions.clip = clip;
      } else {
        delete screenshotOptions.clip;
        requiredField.current = {};
      }
      setScreenshotOptions({
        ...screenshotOptions,
      });
    },
    [screenshotOptions],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;

      let val =
        event.target.type === 'checkbox'
          ? event.target.checked
          : isNumeric(name) && event.target.value !== ''
          ? +event.target.value
          : event.target.value;

      const getClipPopValue = (prop: string) =>
        screenshotOptions &&
        screenshotOptions.clip &&
        screenshotOptions.clip[prop];

      const isSizeProp = (prop: string) =>
        ['width', 'height'].indexOf(prop) !== -1;

      const shouldMatchValue = (prop: string) => {
        if (!isSizeProp(name) || !isSizeProp(prop)) return false;
        const reverse = prop === 'width' ? 'height' : 'width';
        if (!getClipPopValue(reverse) || autoSetPropName.current === reverse) {
          autoSetPropName.current = reverse;
          return true;
        }
        return false;
      };

      const getClipValue = (prop: string) => {
        if (name === prop) return val;

        if (shouldMatchValue(prop)) {
          return val;
        }

        const propValue = getClipPopValue(prop);

        return propValue;
      };

      if (isClipProp(name)) {
        let clip: Clip = {
          height: getClipValue('height'),
          width: getClipValue('width'),
          x: getClipValue('x'),
          y: getClipValue('y'),
        };

        clip = Object.keys(clip).reduce((o, k) => {
          if (clip[k] === undefined || clip[k] === '') return o;
          o[k] = clip[k];
          return o;
        }, {}) as Clip;

        setClipProps(clip);
      } else {
        if (name === 'quality' && (val === '' || val === -1)) val = undefined;
        setScreenshotOptions({ ...screenshotOptions, [name]: val });
      }
    },
    [isClipProp, isNumeric, screenshotOptions, setClipProps],
  );

  const getValue = useCallback(
    (name: string) => {
      if (isClipProp(name)) {
        if (!screenshotOptions.clip) return '';
        return screenshotOptions.clip[name] === undefined
          ? ''
          : screenshotOptions.clip[name];
      }
      return screenshotOptions[name] === undefined
        ? ''
        : screenshotOptions[name];
    },
    [isClipProp, screenshotOptions],
  );

  const handleClear = useCallback(() => {
    requiredField.current = {};
    setScreenshotOptions({});
  }, []);

  const handleBlur = useCallback(() => {
    autoSetPropName.current = undefined;
  }, []);

  const hasRequiredField = Object.keys(requiredField.current).some(
    (x) => requiredField.current[x],
  );

  useThrottleFn(
    (screenshotOptions) => {
      if (hasRequiredField) return;
      onChange(
        !Object.keys(screenshotOptions).length ? undefined : screenshotOptions,
      );
    },
    300,
    [screenshotOptions],
  );

  const handleClipReset = useCallback(() => {
    setClipProps({} as Clip);
  }, [setClipProps]);

  return (
    <div className={classes.root}>
      <div className={classes.title}>Screenshot Options</div>
      <Divider />
      <div className={classes.content}>
        <div className={classes.labelWrapper}>
          <label className={classes.label}>
            Screenshot Clip:
            <Tooltip title="An object which specifies clipping of the resulting image.">
              <HelpOutlineSharpIcon className={classes.helpIcon} />
            </Tooltip>
          </label>
          <IconButton
            onClick={handleClipReset}
            size="small"
            title="Clear clip fields"
          >
            <RestoreIcon style={{ height: 18, width: 18 }} />
          </IconButton>
        </div>

        <form noValidate autoComplete="off" className={classes.form}>
          <TextField
            label="Width"
            inputProps={{ min: '1' }}
            value={getValue('width')}
            name="width"
            size="small"
            variant="outlined"
            onChange={handleChange}
            type="number"
            onBlur={handleBlur}
            error={requiredField.current['width']}
            required={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            inputProps={{ min: '1' }}
            label="Height"
            name="height"
            size="small"
            value={getValue('height')}
            variant="outlined"
            type="number"
            error={requiredField.current['height']}
            required={true}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="X"
            name="x"
            inputProps={{ min: '0' }}
            value={getValue('x')}
            size="small"
            onChange={handleChange}
            variant="outlined"
            error={requiredField.current['x']}
            required={true}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="y"
            label="Y"
            size="small"
            inputProps={{ min: '0' }}
            value={getValue('y')}
            onChange={handleChange}
            variant="outlined"
            error={requiredField.current['y']}
            required={true}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
        <br />
        <label>Other Options:</label>
        <form noValidate autoComplete="off" className={classes.form}>
          <TextField
            name="type"
            select
            label="Type"
            size="small"
            value={getValue('type') ? getValue('type') : 'png'}
            defaultValue="png"
            onChange={handleChange}
            variant="outlined"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          >
            <MenuItem key="png" value="png">
              png
            </MenuItem>
            <MenuItem key="jpeg" value="jpeg">
              jpeg
            </MenuItem>
          </TextField>
          <TextField
            name="quality"
            label="Quality"
            inputProps={{ max: '100', min: '-1' }}
            size="small"
            value={getValue('quality')}
            onChange={handleChange}
            variant="outlined"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
        <form noValidate autoComplete="off" className={classes.form}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(getValue('fullPage'))}
                onChange={handleChange}
                name="fullPage"
                color="primary"
              />
            }
            label={
              <div className={classes.controlLabel}>
                Full Page
                <Tooltip title="When true, takes a screenshot of the full scrollable page, instead of the currently visibvle viewport. Defaults to `false`.">
                  <HelpOutlineSharpIcon className={classes.helpIcon} />
                </Tooltip>
              </div>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(getValue('omitBackground'))}
                onChange={handleChange}
                name="omitBackground"
                color="primary"
              />
            }
            label={
              <div className={classes.controlLabel}>
                Omit Background
                <Tooltip title="Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images. Defaults to `false`.">
                  <HelpOutlineSharpIcon className={classes.helpIcon} />
                </Tooltip>
              </div>
            }
          />
        </form>
      </div>
      <Divider />
      <div className={classes.actions}>
        <div>
          {hasRequiredField && (
            <Typography color="error">
              Please current items highlighted in red.
            </Typography>
          )}
        </div>
        <Button onClick={handleClear}>Clear</Button>
      </div>
    </div>
  );
};

ScreenshotOptions.displayName = 'ScreenshotOptions';

export { ScreenshotOptions };
