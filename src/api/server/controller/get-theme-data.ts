import { getThemeData as getThemeDataService } from '../services/get-theme-data';

export const getThemeData = async (_req, res): Promise<void> => {
  const theme = getThemeDataService();
  res.json(theme);
};
