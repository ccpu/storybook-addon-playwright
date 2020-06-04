// import { useEditScreenshot  } from '../use-edit-screenshot';

const useEditScreenshot = jest.fn();

useEditScreenshot.mockImplementation(() => {
  return {
    clearScreenshotEdit: jest.fn(),
    editScreenshot: jest.fn(),
    editScreenshotState: undefined,
    isEditing: jest.fn(),
    loadSetting: jest.fn(),
  };
});

export { useEditScreenshot };
