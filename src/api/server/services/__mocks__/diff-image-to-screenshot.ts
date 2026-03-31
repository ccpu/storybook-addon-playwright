import { ImageDiffResult } from '../../../typings';

const diffImageToScreenshot = vi.fn();

diffImageToScreenshot.mockImplementation(
  (): ImageDiffResult => ({
    added: true,
  }),
);

export { diffImageToScreenshot };
