import React, { SFC, memo } from 'react';
import { ControlProps } from '../../../typings';
import { FormControl } from './FormControl';
import { useControl } from '../../../hooks';

const Control: SFC<ControlProps> = memo((props) => {
  const {
    label,
    description,
    appendValueToTitle,
    onAppendValueToTitle,
  } = props;

  const { Control, makeChangeHandler, knob } = useControl(props);

  return (
    <FormControl
      label={label}
      appendValueToTitle={appendValueToTitle}
      onAppendValueToTitle={onAppendValueToTitle}
      description={description}
    >
      <Control onChange={makeChangeHandler} knob={knob} required />
    </FormControl>
  );
});

Control.displayName = 'Control';

export { Control };
