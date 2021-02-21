import * as React from 'react';

const Browser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="2 -1 38 38"
    enableBackground="new 0 0 129 129"
    height={22}
    fill="currentColor"
    {...props}
  >
    <path d="M12 9.984l3.984 4.031h-3v6h-1.969v-6h-3zM18.984 3.984q0.844 0 1.43 0.586t0.586 1.43v12q0 0.797-0.609 1.406t-1.406 0.609h-3.984v-2.016h3.984v-9.984h-13.969v9.984h3.984v2.016h-3.984q-0.844 0-1.43-0.586t-0.586-1.43v-12q0-0.844 0.586-1.43t1.43-0.586h13.969z"></path>

    <path xmlns="http://www.w3.org/2000/svg" d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export { Browser };
