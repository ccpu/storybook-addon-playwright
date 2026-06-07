import type { ScreenshotTestTargetType } from '../../../typings';
import React from 'react';
import { setScreenshotUpdateState, useScreenshotUpdateStateValue } from '../../../store';
import { dismissImageDiffToasts } from '../utils/image-diff-toast';

export function useScreenshotUpdateState(
  reqBy: string,
  target?: ScreenshotTestTargetType,
) {
  const updateInf = useScreenshotUpdateStateValue();

  // to prevent rendering loop
  const [isLoadingFinish, setIsLoadingFinish] = React.useState<boolean>(false);

  const runDiffTest = React.useCallback(() => {
    dismissImageDiffToasts();
    setScreenshotUpdateState({ inProgress: true, reqBy, startedAt: Date.now(), target });
  }, [reqBy, target]);

  const handleClose = React.useCallback(() => {
    setScreenshotUpdateState({});
    setIsLoadingFinish(false);
  }, []);

  React.useEffect(() => {
    if (updateInf && updateInf.inProgress && isLoadingFinish)
      setScreenshotUpdateState({ ...updateInf, inProgress: false });
  }, [isLoadingFinish, updateInf]);

  return {
    handleClose,
    runDiffTest,
    setIsLoadingFinish,
    updateInf,
  };
}
