// import { useEditScreenshot  } from '../use-edit-screenshot';

const useEditScreenshot = vi.fn();

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
