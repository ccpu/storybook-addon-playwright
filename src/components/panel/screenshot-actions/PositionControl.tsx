// import React, { SFC, useState, useEffect } from 'react';
// import { Form } from '@storybook/components';
// import { capitalize } from '../../../utils';
// import { makeStyles } from '@material-ui/core';
// import { formStyle } from './styles';
// import { KnobStoreKnob } from '@storybook/addon-knobs/dist/KnobStore';
// import { StoryActionPosition } from '../../../typings';
// import { getKnobControl } from '@storybook/addon-knobs/dist/components/types';

// const useStyles = makeStyles(
//   () => {
//     return {
//       box: {
//         alignItems: 'center',
//         display: 'flex',
//         flex: '1 1 80px',
//         minWidth: '100px',
//       },
//       form: formStyle,
//       label: {
//         fontSize: 14,
//         marginRight: 5,
//       },
//       root: {
//         display: 'flex',
//       },
//       wrapper: {
//         display: 'flex',
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//         width: '100%',
//       },
//     };
//   },
//   { name: 'PositionControl' },
// );

// export interface PositionControlProps {
//   label: string;
//   onChange: (val: StoryActionPosition) => void;
//   value?: StoryActionPosition;
// }

// const PositionControl: SFC<PositionControlProps> = (props) => {
//   const { label, value, onChange } = props;
//   const [knobX, setKnobX] = useState<Partial<KnobStoreKnob>>({
//     name: label,
//     type: 'number',
//     value: (value && value.x) || 0,
//   });
//   const [knobY, setKnobY] = useState<Partial<KnobStoreKnob>>({
//     name: label,
//     type: 'number',
//     value: (value && value.x) || 0,
//   });
//   const classes = useStyles();

//   const ControlX = getKnobControl('number');
//   const ControlY = getKnobControl('number');

//   const makeChangeXHandler = (val): void => {
//     setKnobX({ ...knobX, value: val });
//   };

//   const makeChangeYHandler = (val): void => {
//     setKnobY({ ...knobY, value: val });
//   };

//   useEffect(() => {
//     onChange({ x: knobX.value, y: knobY.value });
//   }, [knobX.value, knobY.value, onChange]);

//   return (
//     <Form className={classes.form}>
//       <Form.Field key={label} label={capitalize(label)}>
//         <div className={classes.wrapper}>
//           <div className={classes.box}>
//             <span className={classes.label}> X:</span>
//             <ControlX knob={knobX} onChange={makeChangeXHandler} />
//           </div>
//           <div className={classes.box}>
//             <span className={classes.label}> Y:</span>
//             <ControlY knob={knobY} onChange={makeChangeYHandler} />
//           </div>
//         </div>
//       </Form.Field>
//     </Form>
//   );
// };

// PositionControl.displayName = 'PositionControl';

// export { PositionControl };
