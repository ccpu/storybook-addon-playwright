import { changeScreenshotIndex as orgChangeScreenshotIndex } from '../../../../src/api/services/change-screenshot-index';

const changeScreenshotIndex = vi.fn<typeof orgChangeScreenshotIndex>();

export { changeScreenshotIndex };
