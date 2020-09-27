/// <reference types="jest" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import 'jest-extended';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchScreenshots(options?: MatchImageSnapshotOptions): R;
    }
  }
  interface Window {
    __visible_snackbar_messages__: { [message: string]: boolean };
  }
}
