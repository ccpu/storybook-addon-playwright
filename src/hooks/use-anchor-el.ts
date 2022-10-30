import React from 'react';

export const useAnchorEl = () => {
  const anchorElRef = React.useRef(null);
  const [anchorEl, _setAnchorEl] = React.useState();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const setAnchorEl = React.useCallback((e?: any) => {
    _setAnchorEl(anchorElRef.current || e.currentTarget);
  }, []);

  const clearAnchorEl = React.useCallback(() => {
    _setAnchorEl(undefined);
  }, []);

  return { anchorEl, anchorElRef, clearAnchorEl, setAnchorEl };
};
