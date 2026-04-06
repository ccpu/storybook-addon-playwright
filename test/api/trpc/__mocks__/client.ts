const makeMutation = () => ({ mutate: vi.fn().mockResolvedValue(undefined) });
const makeQuery = () => ({ query: vi.fn().mockResolvedValue(undefined) });

export const trpc = {
  actionSet: {
    deleteActionSet: makeMutation(),
    getActionSet: makeMutation(),
    saveActionSet: makeMutation(),
  },
  favouriteActions: {
    addFavouriteAction: makeMutation(),
    deleteFavouriteAction: makeMutation(),
    getFavouriteActions: makeQuery(),
  },
  fixTitle: {
    fixScreenshotFileName: makeMutation(),
  },
  schema: {
    getActionsSchema: makeQuery(),
    getSchema: makeMutation(),
  },
  screenshot: {
    changeScreenshotIndex: makeMutation(),
    deleteScreenshot: makeMutation(),
    deleteStoryScreenshots: makeMutation(),
    getStoryScreenshots: makeMutation(),
    saveScreenshot: makeMutation(),
    takeScreenshot: makeMutation(),
    testScreenshot: makeMutation(),
    testScreenshots: makeMutation(),
    testStoryScreenshots: makeMutation(),
    updateScreenshot: makeMutation(),
  },
  theme: {
    getThemeData: makeQuery(),
  },
} as const;
