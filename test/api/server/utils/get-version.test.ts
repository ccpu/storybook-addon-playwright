import path from 'node:path';

import { getVersion } from '../../../../src/api/server/utils/get-version';
import pkg from '../../../../package.json';

describe('getVersion', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should resolve package.json from an upper directory', () => {
    const cwd = process.cwd();
    const nestedCwd = path.join(cwd, 'dist', 'trpc');

    vi.spyOn(process, 'cwd').mockReturnValue(nestedCwd);

    expect(getVersion()).toBe(pkg.version.split('.')[0]);
  });
});
