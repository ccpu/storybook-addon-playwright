import React, { SFC, memo, ComponentType } from 'react';
import { ControlProps } from '../../../typings';
import { FormControl } from './FormControl';
import { useControl } from '../../../hooks';

const Control: SFC<ControlProps & Partial<ComponentType>> = memo((props) => {
  const {
    label,
    description,
    appendValueToTitle,
    onAppendValueToTitle,
  } = props;

  const { Control: StorybookControl, handleChange, knob } = useControl(props);
  console.log('label');
  return (
    <FormControl
      label={label}
      appendValueToTitle={appendValueToTitle}
      onAppendValueToTitle={onAppendValueToTitle}
      description={description}
    >
      <StorybookControl onChange={handleChange} knob={knob} required />
    </FormControl>
  );
});

Control.displayName = 'Control';

export { Control };
