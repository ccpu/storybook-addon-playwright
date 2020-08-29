import { mocked } from 'ts-jest/utils';

export const testScreenshots = jest.fn();

mocked(testScreenshots).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve([
      {
        pass: true,
      },
    ]);
  });
});
