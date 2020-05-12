// import React, { SFC, useState, useCallback } from 'react';
// import {
//   ActionControlPredefinedOptionKeys,
//   ActionControlPredefinedOptions,
// } from '../../../typings';
// // import { PredefinedOptionControl } from './PredefinedOptionControl';

// export interface PredefinedOptionsProps {
//   optionKeys: ActionControlPredefinedOptionKeys[];
//   onChange: (option: ActionControlPredefinedOptions) => void;
//   options?: ActionControlPredefinedOptions;
// }

// const PredefinedOptions: SFC<PredefinedOptionsProps> = (props) => {
//   const { optionKeys, options } = props;

//   const [currentOptions, setCurrentOptions] = useState<
//     ActionControlPredefinedOptions
//   >(options || {});

//   const handleChange = useCallback(
//     (option: ActionControlPredefinedOptionKeys, val: unknown) => {
//       setCurrentOptions({ ...currentOptions, [option]: val });
//     },
//     [currentOptions],
//   );

//   return (
//     <>
//       {optionKeys.map((opt) => (
//         <PredefinedOptionControl
//           key={opt}
//           option={opt}
//           onChange={handleChange}
//           value={currentOptions ? currentOptions[opt] : undefined}
//         />
//       ))}
//     </>
//   );
// };

// PredefinedOptions.displayName = 'PredefinedOptions';

// export { PredefinedOptions };
