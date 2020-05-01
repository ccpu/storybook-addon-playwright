// import React, { SFC, useCallback } from 'react';
// import { ActionControlPredefinedOptionKeys } from '../../../typings';
// import { ControlForm } from './ControlForm';
// // import { PositionControl } from './PositionControl';

// export interface PredefinedOptionControlProps {
//   option: ActionControlPredefinedOptionKeys;
//   value: unknown;
//   onChange: (option, val: unknown) => void;
// }

// const PredefinedOptionControl: SFC<PredefinedOptionControlProps> = (props) => {
//   const { option, onChange, value } = props;

//   const handleChange = useCallback(
//     (val: unknown) => {
//       console.log(val);
//       onChange(option, val);
//     },
//     [onChange, option],
//   );

//   switch (option) {
//     case 'position':
//       return <PositionControl label="Position" onChange={handleChange} />;
//     case 'delay':
//     case 'timeout':
//     case 'clickCount':
//     case 'steps':
//       return (
//         <ControlForm
//           label={option}
//           type="number"
//           onChange={handleChange}
//           value={value}
//         />
//       );

//     case 'value':
//     case 'selector':
//       return (
//         <ControlForm
//           label={option}
//           type="text"
//           onChange={handleChange}
//           value={value}
//         />
//       );

//     case 'force':
//     case 'noWaitAfter':
//       return (
//         <ControlForm
//           label={option}
//           type="boolean"
//           onChange={handleChange}
//           value={value}
//         />
//       );

//     case 'modifiers':
//       return (
//         <ControlForm
//           label={option}
//           type="options"
//           onChange={handleChange}
//           display="inline-check"
//           options={['Alt', 'Control', 'Meta', 'Shift']}
//           value={value}
//         />
//       );

//     case 'button':
//       return (
//         <ControlForm
//           label={option}
//           type="select"
//           onChange={handleChange}
//           options={['left', 'right', 'middle']}
//           value={value}
//         />
//       );

//     case 'waitUntil':
//       return (
//         <ControlForm
//           label={option}
//           type="select"
//           onChange={handleChange}
//           value={value}
//           options={['load', 'domcontentloaded', 'networkidle']}
//         />
//       );

//     default:
//       return null;
//   }
// };

// PredefinedOptionControl.displayName = 'PredefinedOptionControl';

// export { PredefinedOptionControl };
