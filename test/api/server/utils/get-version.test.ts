import path from 'path';

import { getVersion } from '../../../../src/api/server/utils/get-version';

describe('getVersion', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should resolve package.json from an upper directory', () => {
    const cwd = process.cwd();
    const nestedCwd = path.join(cwd, 'dist', 'trpc');

    vi.spyOn(process, 'cwd').mockReturnValue(nestedCwd);

    expect(getVersion()).toBe('4');
  });
});
