import React from 'react';

const LayoutBottom: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 25 25"
      enableBackground="new 0 0 129 129"
      height={20}
      width={20}
      fill="currentColor"
      {...props}
    >
      <path d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zM4 16v3h16v-3H4zm0-2h16V5H4v9z" />
    </svg>
  );
};

LayoutBottom.displayName = 'LayoutBottom';

export { LayoutBottom };
