import React from 'react';
import { fixScreenshotFileName } from '../api/client/fix-screenshot-file-name';
import { useAsyncApiCall } from './use-async-api-call';
import { useCurrentStoryData } from './use-current-story-data';
import { useSnackbar } from './use-snackbar';

interface Props {
  fixFunction?: boolean;
}

export const useFixScreenshotFileName = (props: Props) => {
  const { fixFunction } = props;

  const currentStoryData = useCurrentStoryData();

  const [reload, setReload] = React.useState<boolean>(false);

  const [functionName, setFunctionName] = React.useState<string>('');

  const { openSnackbar } = useSnackbar();

  const [
    showFixScreenshotFileDialog,
    setShowFixScreenshotFileDialog,
  ] = React.useState<boolean>(false);

  const {
    inProgress: fixFileNamesInProgress,
    makeCall,
    clearError,
    error: fixFileNamesError,
  } = useAsyncApiCall(fixScreenshotFileName, false);

  const fixFileNames = React.useCallback(() => {
    if (!functionName && fixFunction) {
      openSnackbar('Enter previous name export function.', {
        variant: 'error',
      });
      return;
    }
    makeCall({ ...currentStoryData, previousNamedExport: functionName }).then(
      (e) => {
        if (!e) setReload(true);
      },
    );
  }, [currentStoryData, fixFunction, functionName, makeCall, openSnackbar]);

  const handleShowFixScreenshotFileDialog = React.useCallback(() => {
    setShowFixScreenshotFileDialog(true);
  }, []);

  const handleHideFixScreenshotFileDialog = React.useCallback(() => {
    setShowFixScreenshotFileDialog(false);
    clearError();
  }, [clearError]);

  const handleReload = React.useCallback(() => {
    document.location.reload();
  }, []);

  const handleFunctionNameInput = React.useCallback((e) => {
    setFunctionName(e.target.value);
  }, []);

  return {
    fixFileNames,
    fixFileNamesError,
    fixFileNamesInProgress,
    functionName,
    handleFunctionNameInput,
    handleHideFixScreenshotFileDialog,
    handleReload,
    handleShowFixScreenshotFileDialog,
    reload,
    setShowFixScreenshotFileDialog,
    showFixScreenshotFileDialog,
  };
};
