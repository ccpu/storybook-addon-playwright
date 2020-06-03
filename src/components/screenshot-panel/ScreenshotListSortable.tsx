import React, { useCallback, SFC } from 'react';
import { useScreenshotIndexChange, useDragStart } from '../../hooks';
import { Loader, ListWrapperSortableContainer } from '../common';
import { SortEnd } from 'react-sortable-hoc';

const ScreenshotListSortable: SFC = ({ children }) => {
  const { setDragStart } = useDragStart();

  const {
    ChangeIndexErrorSnackbar,
    changeIndex,
    ChangeIndexInProgress,
  } = useScreenshotIndexChange();

  const handleDragStart = useCallback(() => {
    setDragStart(true);
  }, [setDragStart]);

  const handleDragEnd = useCallback(
    (e: SortEnd) => {
      setDragStart(false);
      changeIndex(e);
    },
    [changeIndex, setDragStart],
  );

  return (
    <>
      <ListWrapperSortableContainer
        useDragHandle
        onSortEnd={handleDragEnd}
        updateBeforeSortStart={handleDragStart}
      >
        <Loader open={ChangeIndexInProgress} />
        {children}
        <ChangeIndexErrorSnackbar />
      </ListWrapperSortableContainer>
    </>
  );
};

ScreenshotListSortable.displayName = 'ScreenshotListSortable';

export { ScreenshotListSortable };
