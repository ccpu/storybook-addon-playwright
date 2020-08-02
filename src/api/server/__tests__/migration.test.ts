import { migrateFile } from '../migration';
import path from 'path';

jest.mock('nanoid', () => {
  let id = 0;
  return {
    nanoid: () => {
      id++;
      return 'id-' + id;
    },
  };
});

describe('migration', () => {
  it('should migrate to v1', () => {
    const v0FilePath = path.resolve(__dirname, './migration-v0-data.json');
    console.log(v0FilePath);
    const newData = migrateFile(v0FilePath, '1');
    expect(newData).toMatchSnapshot();
  });
});
