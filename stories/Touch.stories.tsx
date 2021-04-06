import React from 'react';
import Draggable from 'react-draggable';
export default { title: 'Touch' };

const StoryComponent: React.FC = () => {
  const [touchState, setTouchState] = React.useState<string>('');

  const handleTouchStart = React.useCallback(() => {
    setTouchState('touch-start');
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    setTouchState('touch-end');
  }, []);

  const handleTouchMove = React.useCallback(() => {
    setTouchState('touch-move');
  }, []);

  const handleTouchCancel = React.useCallback(() => {
    setTouchState('touch-cancel');
  }, []);

  return (
    <Draggable>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        style={{ background: 'red', height: 100, width: 100 }}
      >
        {touchState}
      </div>
    </Draggable>
  );
};

export const withDefault = () => <StoryComponent />;
