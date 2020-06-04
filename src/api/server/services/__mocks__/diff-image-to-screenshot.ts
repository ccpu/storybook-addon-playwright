import { ImageDiffResult } from '../../../typings';

const diffImageToScreenshot = jest.fn();

diffImageToScreenshot.mockImplementation(
  (): ImageDiffResult => ({
    added: true,
  }),
);

export { diffImageToScreenshot };
