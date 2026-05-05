import React from 'react';
import { ScreenshotPanel } from './ScreenshotPanel';
import { CommonProvider } from '../../../../components/common';
import { MemoizedStoryScreenshotPreview } from './StoryScreenshotPreview';
import { useScreenshotUpdateState } from '../../hooks/use-screenshot-update-state';

export interface ScreenshotMainProps {
  showPanel: boolean;
}

const ScreenshotMain: React.FC<ScreenshotMainProps> = ({ showPanel }) => {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const { updateInf, handleClose, setIsLoadingFinish } =
    useScreenshotUpdateState('');

  const handleOnLoad = React.useCallback(() => {
    setDialogOpen(true);
    setIsLoadingFinish(true);
  }, [setIsLoadingFinish]);

  const handleOnClose = React.useCallback(() => {
    handleClose();
    setDialogOpen(false);
  }, [handleClose]);

  return (
    <CommonProvider>
      {showPanel && !dialogOpen && <ScreenshotPanel />}

      {updateInf.reqBy && (
        <MemoizedStoryScreenshotPreview
          onClose={handleOnClose}
          updating={true}
          target={updateInf.target ?? 'story'}
          onLoad={handleOnLoad}
        />
      )}
    </CommonProvider>
  );
};

ScreenshotMain.displayName = 'ScreenshotMain';

export { ScreenshotMain };
