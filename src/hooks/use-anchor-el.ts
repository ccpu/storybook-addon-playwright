import React from 'react';

export const useAnchorEl = () => {
  const anchorElRef = React.useRef<any>(null);
  const [anchorEl, _setAnchorEl] = React.useState<any>();

  const setAnchorEl = React.useCallback((e?: any) => {
    _setAnchorEl(anchorElRef.current || e.currentTarget);
  }, []);

  const clearAnchorEl = React.useCallback(() => {
    _setAnchorEl(undefined);
  }, []);

  return { anchorEl, anchorElRef, clearAnchorEl, setAnchorEl };
};
