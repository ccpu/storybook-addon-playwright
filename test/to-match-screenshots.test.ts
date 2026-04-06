import { toMatchScreenshots } from '../src/to-match-screenshots';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

vi.mock(
  '../src/api/server/utils/load-story-data',
  async () => await import('./api/server/utils/__mocks__/load-story-data'),
);
vi.mock(
  '../src/api/services/make-screenshot',
  async () => await import('./api/services/__mocks__/make-screenshot'),
);

describe('toMatchScreenshots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should pass', async () => {
    const successMockData = {
      message: () => 'mock passed',
      pass: true,
    };
    (toMatchImageSnapshot as Mock)
      .mockImplementationOnce(() => successMockData)
      .mockImplementationOnce(() => successMockData);

    const result = await toMatchScreenshots.call(
      { currentTestName: 'test-name', testPath: 'file.test.ts' },
      'test.playwright.json',
    );

    expect(result.pass).toBeTruthy();
    expect(result.message()).toBe('expected page screenshot to match.');
  });
  it('should fail', async () => {
    const failMockData = {
      message: () => 'mock failed',
      pass: false,
    };

    (toMatchImageSnapshot as Mock)
      .mockImplementationOnce(() => failMockData)
      .mockImplementationOnce(() => failMockData);

    const result = await toMatchScreenshots.call(
      { testPath: 'file.test.ts' },
      'test.playwright.json',
    );
    expect(result.pass).toBeFalsy();
    expect(result.message()).toBe('mock failed');
  });
});
