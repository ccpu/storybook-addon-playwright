import React, { SFC } from 'react';

const LayoutRight: SFC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 25 25"
      enableBackground="new 0 0 129 129"
      height={20}
      width={20}
      style={{
        fill: 'currentColor',
      }}
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm-6 2H4v14h11V5zm5 0h-3v14h3V5z" />
    </svg>
  );
};

LayoutRight.displayName = 'LayoutRight';

export { LayoutRight };
