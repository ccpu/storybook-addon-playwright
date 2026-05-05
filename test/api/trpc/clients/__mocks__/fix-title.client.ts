import { fixScreenshotFileName as orgFixScreenshotFileName } from '../../../../../src/api/services/fix-screenshot-file-name';

export const fixScreenshotFileName = vi.fn<typeof orgFixScreenshotFileName>();
