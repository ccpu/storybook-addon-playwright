import React, { SFC } from 'react';

const LayoutBottomRight: SFC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="2 3 20 20"
      enableBackground="new 0 0 129 129"
      height={22}
      fill="currentColor"
      style={{
        fill: 'currentColor',
        transform: 'rotate(180deg)',
      }}
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M4 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4zm4-11H5v9h3v-9zm11 0h-9v9h9v-9zm0-5H5v3h14V5z" />
    </svg>
  );
};

LayoutBottomRight.displayName = 'LayoutBottomRight';

export { LayoutBottomRight };
