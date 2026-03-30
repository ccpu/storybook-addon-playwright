const makeMutation = () => ({ mutate: jest.fn().mockResolvedValue(undefined) });
const makeQuery = () => ({ query: jest.fn().mockResolvedValue(undefined) });

export const trpc = {
  screenshot: {
    takeScreenshot: makeMutation(),
    saveScreenshot: makeMutation(),
    deleteScreenshot: makeMutation(),
    updateScreenshot: makeMutation(),
    testScreenshot: makeMutation(),
    getStoryScreenshots: makeMutation(),
    deleteStoryScreenshots: makeMutation(),
    changeScreenshotIndex: makeMutation(),
    testStoryScreenshots: makeMutation(),
    testScreenshots: makeMutation(),
  },
  actionSet: {
    saveActionSet: makeMutation(),
    getActionSet: makeMutation(),
    deleteActionSet: makeMutation(),
  },
  favouriteActions: {
    addFavouriteAction: makeMutation(),
    getFavouriteActions: makeQuery(),
    deleteFavouriteAction: makeMutation(),
  },
  schema: {
    getActionsSchema: makeQuery(),
    getSchema: makeMutation(),
  },
  theme: {
    getThemeData: makeQuery(),
  },
  fixTitle: {
    fixScreenshotFileName: makeMutation(),
  },
} as const;
