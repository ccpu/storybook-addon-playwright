import { ImageDiffResult } from '../src/api/typings';

export const runDiffImageToSnapshotMock = jest.fn() as jest.Mock<
  ImageDiffResult
>;

jest.mock('jest-image-snapshot/src/diff-snapshot', () => ({
  runDiffImageToSnapshot: runDiffImageToSnapshotMock,
}));

runDiffImageToSnapshotMock.mockImplementation(() => {
  return {
    added: true,
  };
});
