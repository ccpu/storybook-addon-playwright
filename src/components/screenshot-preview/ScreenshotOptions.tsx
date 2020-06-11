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
} from '@material-ui/core';
import HelpOutlineSharpIcon from '@material-ui/icons/HelpOutlineSharp';
import useThrottleFn from 'react-use/lib/useThrottleFn';

const useStyles = makeStyles((theme) =>
  createStyles({
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
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

const ScreenshotOptions: SFC<ScreenshotOptionsProps> = ({
  onChange,
  options = {},
}) => {
  const classes = useStyles();

  const [autoSetPropName, setAutoSetPropName] = useState<string>();
  const requiredField = useRef<{ [key: string]: boolean }>({});

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
        if (!getClipPopValue(reverse) || autoSetPropName === reverse) {
          setAutoSetPropName(reverse);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let clip: any = {
          height: getClipValue('height'),
          width: getClipValue('width'),
          x: getClipValue('x'),
          y: getClipValue('y'),
        };

        clip = Object.keys(clip).reduce((o, k) => {
          if (clip[k] === undefined || clip[k] === '') return o;
          o[k] = clip[k];
          return o;
        }, {});

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
      } else {
        if (name === 'quality' && val === 0) val = undefined;
        setScreenshotOptions({ ...screenshotOptions, [name]: val });
      }
    },
    [autoSetPropName, isClipProp, isNumeric, screenshotOptions],
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
    setAutoSetPropName(undefined);
  }, []);

  useThrottleFn(
    (screenshotOptions) => {
      if (
        Object.keys(requiredField.current).some((x) => requiredField.current[x])
      )
        return;
      onChange(
        !Object.keys(screenshotOptions).length ? undefined : screenshotOptions,
      );
    },
    300,
    [screenshotOptions],
  );

  return (
    <div className={classes.root}>
      <div className={classes.title}>Screenshot Options</div>
      <Divider />
      <div className={classes.content}>
        <label className={classes.label}>
          Screenshot Clip:
          <Tooltip title="An object which specifies clipping of the resulting image.">
            <HelpOutlineSharpIcon className={classes.helpIcon} />
          </Tooltip>
        </label>
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
            inputProps={{ max: '100', min: '0' }}
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
        <Button onClick={handleClear}>Clear</Button>
      </div>
    </div>
  );
};

ScreenshotOptions.displayName = 'ScreenshotOptions';

export { ScreenshotOptions };
