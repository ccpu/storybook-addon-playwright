import React, { SFC, memo, ComponentType } from 'react';
import { ControlProps } from '../../typings';
import { FormControl } from './FormControl';
import { useControl } from '../../hooks';

const Control: SFC<ControlProps & Partial<ComponentType>> = memo((props) => {
  const {
    label,
    description,
    appendValueToTitle,
    onAppendValueToTitle,
    isRequired,
    value,
  } = props;

  const { Control: StorybookControl, handleChange, knob } = useControl(props);

  return (
    <FormControl
      label={label}
      appendValueToTitle={appendValueToTitle}
      onAppendValueToTitle={onAppendValueToTitle}
      description={description}
      isRequired={isRequired}
      active={
        value !== undefined && value !== 0 && value !== '' && value !== false
      }
    >
      <StorybookControl onChange={handleChange} knob={knob} required />
    </FormControl>
  );
});

Control.displayName = 'Control';

export { Control };
