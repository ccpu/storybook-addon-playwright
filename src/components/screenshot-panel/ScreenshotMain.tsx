import React, { SFC } from 'react';
import { ScreenshotPanel } from './ScreenshotPanel';
import { ScreenshotProvider } from '../../store/screenshot';
import { CommonProvider } from '../common';
import { MemoizedStoryScreenshotPreview } from './StoryScreenshotPreview';
import { useScreenshotListUpdateDialog } from '../../hooks';

export interface ScreenshotMainProps {
  showPanel: boolean;
}

const ScreenshotMain: SFC<ScreenshotMainProps> = ({ showPanel }) => {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const { updateInf, handleClose } = useScreenshotListUpdateDialog('');

  const handleOnLoad = React.useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleOnClose = React.useCallback(() => {
    handleClose();
    setDialogOpen(false);
  }, [handleClose]);

  return (
    <CommonProvider>
      <ScreenshotProvider>
        {showPanel && !dialogOpen && <ScreenshotPanel />}

        {updateInf.reqBy && (
          <MemoizedStoryScreenshotPreview
            onClose={handleOnClose}
            updating={true}
            target={updateInf.target}
            onLoad={handleOnLoad}
          />
        )}
      </ScreenshotProvider>
    </CommonProvider>
  );
};

ScreenshotMain.displayName = 'ScreenshotMain';

export { ScreenshotMain };