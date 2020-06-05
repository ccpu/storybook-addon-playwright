import React, { SFC, useCallback } from 'react';
import Settings from '@material-ui/icons/Settings';
import { IconButton, Popover } from '@material-ui/core';
import { ScreenshotData } from '../../typings';
import ReactJson from 'react-json-view';

export interface ScreenshotInfoProps {
  screenshotData: ScreenshotData;
  size?: 'small' | 'medium';
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  onClose?: () => void;
}

const ScreenshotInfo: SFC<ScreenshotInfoProps> = ({
  screenshotData,
  size = 'small',
  color,
  onClose,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const getInfo = useCallback(() => {
    const data = { ...screenshotData };

    if (data.props) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any).props = data.props.reduce((obj, prop) => {
        obj[prop.name] = prop.value;
        return obj;
      }, {});
    }
    if (data.actions) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any).actions = data.actions.reduce((obj, action) => {
        obj[action.name] = action.args;
        return obj;
      }, {});
    }
    delete data.hash;
    delete data.index;

    return data;
  }, [screenshotData]);

  const togglePopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onClose && anchorEl) onClose();
      setAnchorEl(anchorEl ? undefined : event.currentTarget);
    },
    [anchorEl, onClose],
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
