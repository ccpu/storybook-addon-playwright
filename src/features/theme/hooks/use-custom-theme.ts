import { Theme } from '@material-ui/core';
import React from 'react';
import { trpcClient } from '../../../api/trpc/client';

export const useCustomTheme = () => {
  const [theme, setTheme] = React.useState<Theme>();
  const isTheme = React.useRef(false);

  const { data } = trpcClient.theme.getThemeData.useQuery();

  React.useEffect(() => {
    if (!isTheme.current && data) {
      setTheme(data as Theme);
    }
    return () => {
      isTheme.current = true;
    };
  }, [data]);

  return { setTheme, theme };
};
