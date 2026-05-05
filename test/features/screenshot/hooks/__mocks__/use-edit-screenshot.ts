// import { useEditScreenshot  } from '../use-edit-screenshot';

import { useEditScreenshot as orgUseEditScreenshot } from '../../../../../src/features/screenshot/hooks/use-edit-screenshot';

const useEditScreenshot = vi.fn<typeof orgUseEditScreenshot>();

useEditScreenshot.mockImplementation(() => {
  return {
    clearScreenshotEdit: vi.fn(),
    editScreenshot: vi.fn(),
    editScreenshotState: undefined,
    isEditing: vi.fn(),
    loadSetting: vi.fn(),
  };
});

export { useEditScreenshot };
