/// <reference types="jest" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toMatchScreenshots(options?: MatchImageSnapshotOptions): R;
    }
  }
}

export {};
//
