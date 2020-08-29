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

  const runDiffTest = React.useCallback(() => {
    setUpdateInf({ inProgress: true, reqBy, target });
  }, [reqBy, setUpdateInf, target]);

  const handleClose = React.useCallback(() => {
    setUpdateInf({});
  }, [setUpdateInf]);

  return { handleClose, runDiffTest, updateInf };
};
