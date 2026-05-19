import type {
  Assertion,
  AsymmetricMatchersContaining,
  Mock as VitestMock,
  Mocked as VitestMocked,
} from 'vitest';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import type { Theme } from '@mui/material/styles';

declare module 'vitest' {
  interface Assertion<T = any> {
    toMatchImageSnapshot(options?: MatchImageSnapshotOptions): T;
    toMatchScreenshots(options?: MatchImageSnapshotOptions): T;
  }

  interface AsymmetricMatchersContaining {
    toMatchImageSnapshot(options?: MatchImageSnapshotOptions): void;
    toMatchScreenshots(options?: MatchImageSnapshotOptions): void;
  }
}

declare global {
  type Mock<T extends (...args: any[]) => any = (...args: any[]) => any> = VitestMock<T>;
  type Mocked<T> = VitestMocked<T>;
}

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

export type _VitestAssertion = Assertion;
export type _VitestAsymmetricMatchersContaining = AsymmetricMatchersContaining;
