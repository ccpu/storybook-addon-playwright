import { Theme } from '@material-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getThemeData } from '../api/client/get-theme-data';

export const useCustomTheme = () => {
  const [theme, setTheme] = useState<Theme>();
  const isTheme = useRef(false);

  const fetchTheme = useCallback(async () => {
    try {
      const resp = await getThemeData();
      if (!isTheme.current) {
        setTheme(resp);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }, []);

  useEffect(() => {
    fetchTheme();
    return () => {
      isTheme.current = true;
    };
  }, [fetchTheme]);

  return { setTheme, theme };
};
