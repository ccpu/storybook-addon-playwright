import {
  setScreenshotOptionsState,
  useScreenshotOptionsValue,
} from '../../../store';

export function useScreenshotOptions() {
  const screenshotOptions = useScreenshotOptionsValue();
  return { screenshotOptions, setScreenshotOptions: setScreenshotOptionsState };
}
