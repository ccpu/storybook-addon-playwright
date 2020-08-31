import React from 'react';
import { useGlobalState } from './use-global-state';
import { ScreenshotTestTargetType } from '../typings';

interface Options {
  inProgress?: boolean;
  target?: ScreenshotTestTargetType;
  reqBy?: string;
}

export const useScreenshotListUpdateDialog = (
  reqBy: string,
  target?: ScreenshotTestTargetType,
) => {
  const [updateInf, setUpdateInf] = useGlobalState<Options>(
    'useScreenshotListUpdateDialog',
    {},
  );

  // to prevent rendering loop
  const [isLoadingFinish, setIsLoadingFinish] = React.useState<boolean>(false);

  const runDiffTest = React.useCallback(() => {
    setUpdateInf({ inProgress: true, reqBy, target });
  }, [reqBy, setUpdateInf, target]);

  const handleClose = React.useCallback(() => {
    setUpdateInf({});
    setIsLoadingFinish(false);
  }, [setUpdateInf]);

  React.useEffect(() => {
    if (updateInf && updateInf.inProgress && isLoadingFinish)
      setUpdateInf({ ...updateInf, inProgress: false });
  }, [isLoadingFinish, setUpdateInf, updateInf]);

  return {
    handleClose,
    runDiffTest,
    setIsLoadingFinish,
    updateInf,
  };
};
