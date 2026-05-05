import { ImageDiffResult } from '../../../../src/api/typings';

import { diffImageToScreenshot as orgDiffImageToScreenshot } from '../../../../src/api/services/diff-image-to-screenshot';

const diffImageToScreenshot = vi.fn<typeof orgDiffImageToScreenshot>();

diffImageToScreenshot.mockImplementation(() =>
  Promise.resolve({
    added: true,
    pass: false,
  } as ImageDiffResult),
);

export { diffImageToScreenshot };
