import { useGlobalState } from './use-global-state';
import { ScreenshotOptions } from '../typings';
import { Dispatch, SetStateAction } from 'react';

export const useScreenshotOptions: () => {
  screenshotOptions: ScreenshotOptions;
  setScreenshotOptions: Dispatch<SetStateAction<ScreenshotOptions>>;
} = () => {
  const [screenshotOptions, setScreenshotOptions] = useGlobalState<
    ScreenshotOptions
  >('screenshotOptions', {}, true);

  return { screenshotOptions, setScreenshotOptions };
};
