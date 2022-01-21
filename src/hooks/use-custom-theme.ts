import { Theme } from '@mui/material';
import React from 'react';
import { getThemeData } from '../api/client/get-theme-data';

export const useCustomTheme = () => {
  const [theme, setTheme] = React.useState<Theme>();
  const isTheme = React.useRef(false);

  const fetchTheme = React.useCallback(async () => {
    try {
      const resp = await getThemeData();
      if (!isTheme.current && resp) {
        setTheme(resp);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }, []);

  React.useEffect(() => {
    fetchTheme();
    return () => {
      isTheme.current = true;
    };
  }, [fetchTheme]);

  return { setTheme, theme };
};
