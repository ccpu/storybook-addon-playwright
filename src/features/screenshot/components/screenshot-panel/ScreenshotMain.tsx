import React from 'react';
import { CommonProvider } from '../../../../components/common';
import { formatElapsedTime } from '../../../../utils';
import { useScreenshotUpdateState } from '../../hooks/use-screenshot-update-state';
import { showImageDiffUpdateFinishedToast } from '../../utils/image-diff-toast';
import { ScreenshotPanel } from './ScreenshotPanel';
import { MemoizedStoryScreenshotPreview } from './StoryScreenshotPreview';

export interface ScreenshotMainProps {
  showPanel: boolean;
}

const ScreenshotMain: React.FC<ScreenshotMainProps> = ({ showPanel }) => {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const { updateInf, handleClose, setIsLoadingFinish } = useScreenshotUpdateState('');

  const handleOnLoad = React.useCallback(() => {
    setDialogOpen(true);
    setIsLoadingFinish(true);

    if (updateInf.startedAt) {
      const elapsedTime = formatElapsedTime(Date.now() - updateInf.startedAt);
      const scope =
        updateInf.target === 'file' ? 'Story file screenshot diff' : 'Screenshot diff';

      showImageDiffUpdateFinishedToast(
        `${scope} finished in ${elapsedTime}. Review the differences.`,
      );
    }
  }, [setIsLoadingFinish, updateInf.startedAt, updateInf.target]);

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
