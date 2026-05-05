import { getThemeData as orgGetThemeData } from '../../../../src/api/services/get-theme-data';

const getThemeData = vi.fn<typeof orgGetThemeData>();

export { getThemeData };
