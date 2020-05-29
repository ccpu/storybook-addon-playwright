import React, { SFC } from 'react';
import { MapInteraction } from 'react-map-interaction';
import { useKeyPress } from '../../hooks';

export interface ScreenshotPreviewProps {
  imgSrcString: string;
}

const ScreenshotPreview: SFC<ScreenshotPreviewProps> = (props) => {
  const { imgSrcString } = props;
  const isPressed = useKeyPress('Control');
  if (!imgSrcString) return null;
  return (
    <MapInteraction defaultScale={1} disableZoom={!isPressed}>
      {({ translation, scale }) => {
        // Translate first and then scale.  Otherwise, the scale would affect the translation.
        const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
        return (
          <div
            style={{
              MozUserSelect: 'none',
              WebkitUserSelect: 'none',
              cursor: 'all-scroll', // for absolutely positioned children
              height: '100%',
              msTouchAction: 'none', // Not supported in Safari :(
              msUserSelect: 'none',
              overflow: 'auto',
              position: 'relative',
              touchAction: 'none',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'inline-block', // size to content
                transform: transform,
                transformOrigin: '0 0 ',
              }}
            >
              <img
                src={
                  imgSrcString.startsWith('data:image')
                    ? imgSrcString
                    : 'data:image/gif;base64,' + imgSrcString
                }
              />
            </div>
          </div>
        );
      }}
    </MapInteraction>
  );
};

ScreenshotPreview.displayName = 'ScreenshotPreview';

export { ScreenshotPreview };
