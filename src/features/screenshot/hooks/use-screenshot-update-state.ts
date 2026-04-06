import React from 'react';
import {
  useScreenshotUpdateStateValue,
  setScreenshotUpdateState,
} from '../../../store';
import { ScreenshotTestTargetType } from '../../../typings';

export const useScreenshotUpdateState = (
  reqBy: string,
  target?: ScreenshotTestTargetType,
) => {
  const updateInf = useScreenshotUpdateStateValue();

  // to prevent rendering loop
  const [isLoadingFinish, setIsLoadingFinish] = React.useState<boolean>(false);

  const runDiffTest = React.useCallback(() => {
    setScreenshotUpdateState({ inProgress: true, reqBy, target });
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
};
