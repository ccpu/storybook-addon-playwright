import { getThemeData as orgGetThemeData } from '../../../../../src/api/services/get-theme-data';

export const getThemeData = vi.fn<typeof orgGetThemeData>();
