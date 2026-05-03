import React from 'react';
import { trpcClient } from '../../../api';
import { useCurrentStoryData } from '../../../hooks/use-current-story-data';
import { useSnackbar } from '../../../hooks/use-snackbar';
import { toast } from '../../../utils/toast';

interface Props {
  fixFunction?: boolean;
}

export const useFixScreenshotFileName = (props: Props) => {
  const { fixFunction } = props;

  const currentStoryData = useCurrentStoryData();

  const [reload, setReload] = React.useState<boolean>(false);

  const [functionName, setFunctionName] = React.useState<string>('');

  const { openSnackbar } = useSnackbar();

  const [showFixScreenshotFileDialog, setShowFixScreenshotFileDialog] =
    React.useState<boolean>(false);

  const [fixFileNamesError, setFixFileNamesError] = React.useState<
    string | undefined
  >(undefined);

  const { mutateAsync, isPending: fixFileNamesInProgress } =
    trpcClient.fixTitle.fixScreenshotFileName.useMutation({
      onError: (error) => {
        const message = error.message || 'Unexpected error occurred';
        setFixFileNamesError(message);
        toast.error(message);
      },
    });

  const clearError = React.useCallback(() => {
    setFixFileNamesError(undefined);
  }, []);

  const fixFileNames = React.useCallback(() => {
    if (!functionName && fixFunction) {
      openSnackbar('Enter previous name export function.', {
        variant: 'error',
      });
      return;
    }
    setFixFileNamesError(undefined);
    mutateAsync({
      ...currentStoryData,
      previousNamedExport: functionName,
    })
      .then(() => {
        setReload(true);
      })
      .catch(() => {
        return;
      });
  }, [currentStoryData, fixFunction, functionName, mutateAsync, openSnackbar]);

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
