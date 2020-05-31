import React, { SFC, useCallback } from 'react';
import Settings from '@material-ui/icons/Settings';
import { IconButton, Popover } from '@material-ui/core';
import { ScreenshotData } from '../../typings';
import ReactJson from 'react-json-view';

export interface ScreenshotInfoProps {
  screenshotData: ScreenshotData;
  size?: 'small' | 'medium';
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
}

const ScreenshotInfo: SFC<ScreenshotInfoProps> = ({
  screenshotData,
  size = 'small',
  color,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const getInfo = useCallback(() => {
    const data = { ...screenshotData };
    if (data.knobs) {
      (data as {
        props?: { [k: string]: unknown };
      }).props = data.knobs.reduce((obj, knob) => {
        obj[knob.name] = knob.value;
        return obj;
      }, {});
      delete data.knobs;
    }
    if (data.actions) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any).actions = data.actions.reduce((obj, action) => {
        obj[action.name] = action.args;
        return obj;
      }, {});
    }
    delete data.hash;

    return data;
  }, [screenshotData]);

  const togglePopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setAnchorEl(anchorEl ? undefined : event.currentTarget);
    },
    [anchorEl],
  );

  return (
    <>
      <IconButton color={color} onClick={togglePopover} size={size}>
        <Settings />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={togglePopover}
      >
        <div>
          {anchorEl && (
            <ReactJson
              enableClipboard={false}
              theme="railscasts"
              src={getInfo()}
              displayObjectSize={false}
              displayDataTypes={false}
              style={{ fontSize: 13 }}
            />
          )}
        </div>
      </Popover>
    </>
  );
};

ScreenshotInfo.displayName = 'ScreenshotInfo';

export { ScreenshotInfo };
