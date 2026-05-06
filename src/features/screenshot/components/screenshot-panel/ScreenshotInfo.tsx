import React, { useCallback } from 'react';

import { Popover } from '@material-ui/core';
import { ScreenshotData } from '../../../../typings';
import ReactJson from 'react-json-view';
import { IconButton } from '@storybook/components';
import { CogIcon } from '@storybook/icons';

export interface ScreenshotInfoProps {
  screenshotData: ScreenshotData;
  size?: 'small' | 'medium';
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  onClose?: () => void;
}

const ScreenshotInfo: React.FC<ScreenshotInfoProps> = ({
  screenshotData,
  size = 'small',
  color,
  onClose,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const getInfo = useCallback(() => {
    const { id: _id, index: _index, ...data } = screenshotData;
    return data;
  }, [screenshotData]);

  const togglePopover = useCallback(
    (event: React.SyntheticEvent<Element, Event>) => {
      if (onClose && anchorEl) onClose();
      setAnchorEl(anchorEl ? null : event.currentTarget);
    },
    [anchorEl, onClose],
  );

  return (
    <>
      <IconButton color={color} onClick={togglePopover} size={size}>
        <CogIcon />
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
