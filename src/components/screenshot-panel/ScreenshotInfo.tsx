import React, { SFC, useCallback } from 'react';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { IconButton, Popover } from '@material-ui/core';
import { ScreenshotData } from '../../typings';
import ReactJson from 'react-json-view';

export interface ScreenshotInfoProps {
  screenshotData: ScreenshotData;
}

const ScreenshotInfo: SFC<ScreenshotInfoProps> = (props) => {
  const { screenshotData } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const getInfo = useCallback(() => {
    const data = screenshotData;
    if (data.knobs) {
      (data as {
        props?: { [k: string]: unknown };
      }).props = data.knobs.reduce((obj, knob) => {
        obj[knob.name] = knob.value;
        return obj;
      }, {});
      delete data.knobs;
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
      <IconButton onClick={togglePopover} size="small">
        <InfoOutlined />
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
