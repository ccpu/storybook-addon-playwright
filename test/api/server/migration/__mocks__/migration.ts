import { migration as orgMigration } from '../../../../../src/api/server/migration/migration';

export const migration = vi.fn<typeof orgMigration>();
