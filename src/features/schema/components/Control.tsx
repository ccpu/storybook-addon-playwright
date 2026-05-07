import type { ComponentType } from 'react';
import type { ControlProps } from '../../../typings';
import React, { memo } from 'react';
import { useControl } from '../../../hooks';
import { FormControl } from './FormControl';

const Control: React.FC<ControlProps & Partial<ComponentType>> = memo(
  (props) => {
    const {
      label,
      description,
      appendValueToTitle,
      onAppendValueToTitle,
      isRequired,
      value,
      defaultValue,
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
          defaultValue !== value &&
          value !== undefined &&
          value !== '' &&
          value !== false
        }
      >
        <StorybookControl onChange={handleChange} knob={knob} />
      </FormControl>
    );
  },
);

Control.displayName = 'Control';

export { Control };
