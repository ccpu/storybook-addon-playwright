import { readFileSync } from 'jsonfile';
import { migrateToV1 } from '../migration-v1';
import { migrationV2 } from '../migration-v2';
import path from 'path';
import { migrateFile } from '../migration';

describe('migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should migrate from v0 to v1', () => {
    const v0FilePath = path.resolve(__dirname, './migration-v0-data.json');
    const data = readFileSync(v0FilePath);
    const newData = migrateToV1(data, '1');
    expect(newData).toMatchSnapshot();
  });

  it('should migrate from v1 to v2', () => {
    const v1FilePath = path.resolve(__dirname, './migration-v1-data.json');
    const data = readFileSync(v1FilePath);
    const newData = migrationV2(data, '2');
    expect(newData).toMatchSnapshot();
  });

  it('should migrate from v0 to v2', () => {
    const v0FilePath = path.resolve(__dirname, './migration-v0-data.json');
    const newData = migrateFile(v0FilePath, '2');
    expect(newData).toMatchSnapshot();
  });
});
