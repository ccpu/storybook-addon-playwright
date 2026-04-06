import { ImageDiffResult } from '../../src/api/typings';

export const runDiffImageToSnapshotMock = vi.fn<() => ImageDiffResult>();

vi.mock('jest-image-snapshot/src/diff-snapshot', () => ({
  runDiffImageToSnapshot: runDiffImageToSnapshotMock,
}));

runDiffImageToSnapshotMock.mockImplementation(() => {
  return {
    added: true,
  };
});
