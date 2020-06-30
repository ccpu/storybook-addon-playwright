import React, { SFC, useEffect, useRef, useState } from 'react';
import { MapInteraction } from 'react-map-interaction';
import { useKeyPress } from '../../hooks';
import { DiffDirection } from '../../api/typings/image-diff';

export interface ImagePreviewProps {
  imgSrcString: string;
  diffDirection?: DiffDirection;
}

const ImagePreview: SFC<ImagePreviewProps> = (props) => {
  const { imgSrcString, diffDirection } = props;
  const isPressed = useKeyPress('Control');
  const prevImage = useRef<string>();
  const timer = useRef<number>(0);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (prevImage.current !== imgSrcString) {
      setReset(true);
      timer.current = window.setTimeout(() => {
        setReset(false);
      }, 2);
    }
    prevImage.current === imgSrcString;
    () => window.clearTimeout(timer.current);
  }, [imgSrcString]);

  if (!imgSrcString || reset) return null;

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
                width: '100%',
              }}
            >
              <img
                style={{
                  width: diffDirection === 'horizontal' ? '100%' : undefined,
                }}
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

ImagePreview.displayName = 'ImagePreview';

export { ImagePreview };
