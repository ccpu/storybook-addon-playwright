import {
  useScreenshotOptionsValue,
  setScreenshotOptionsState,
} from '../../../store';

export const useScreenshotOptions = () => {
  const screenshotOptions = useScreenshotOptionsValue();
  return { screenshotOptions, setScreenshotOptions: setScreenshotOptionsState };
};
