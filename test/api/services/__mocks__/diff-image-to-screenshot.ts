import { ImageDiffResult } from '../../../../src/api/typings';

const diffImageToScreenshot = vi.fn();

diffImageToScreenshot.mockImplementation(
  (): ImageDiffResult => ({
    added: true,
    pass: false,
  }),
);

export { diffImageToScreenshot };
