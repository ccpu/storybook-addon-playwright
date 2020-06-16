import { toMatchImageSnapshot as toMatchImageSnapshotOrg } from 'jest-image-snapshot';
export const toMatchImageSnapshot = jest.fn();

toMatchImageSnapshot.mockImplementation(toMatchImageSnapshotOrg);
