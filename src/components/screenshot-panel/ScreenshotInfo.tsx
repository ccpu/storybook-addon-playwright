import React, { useCallback } from 'react';
import Settings from '@mui/icons-material/Settings';
import { IconButton, Popover } from '@mui/material';
import { ScreenshotData } from '../../typings';
import ReactJson from 'react-json-view';

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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const getInfo = useCallback(() => {
    const data = { ...screenshotData };

    delete data.id;
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
