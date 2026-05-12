import { useMemo } from 'react';
import { useMeasure } from 'react-use';

const GRID_PERCENT = 100;
const TWO_COLUMNS = 2;
const LIST_GAP_PX = 2;

export const useScreenshotListLayout = (
  column: number | undefined,
  activeBrowsersCount: number,
) => {
  const [ref, rect] = useMeasure<HTMLDivElement>();

  const width = useMemo(() => {
    const columns = column || activeBrowsersCount || 1;
    return `calc(${GRID_PERCENT / columns}% - ${LIST_GAP_PX}px)`;
  }, [activeBrowsersCount, column]);

  const itemHeight = useMemo(() => {
    if (column === 1) {
      return rect.height / (activeBrowsersCount || 1);
    }
    if (column === TWO_COLUMNS) {
      return rect.height / TWO_COLUMNS;
    }
    return rect.height;
  }, [activeBrowsersCount, column, rect.height]);

  return {
    itemHeight,
    ref,
    width,
  };
};
