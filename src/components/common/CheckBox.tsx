import { IconButton } from '@storybook/components';

import { FormIcon, StopAltHollowIcon } from '@storybook/icons';
import React from 'react';

export interface CheckBoxProps {
  onClick: () => void;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const { onClick, checked, onChange } = props;

  const handleClick = React.useCallback(() => {
    onClick();
    if (onChange) {
      onChange(!checked);
    }
  }, [onClick, onChange, checked]);

  return (
    <IconButton className="check-box" onClick={handleClick} size="small" active={checked}>
      {checked ? <FormIcon /> : <StopAltHollowIcon />}
    </IconButton>
  );
};

CheckBox.displayName = 'CheckBox';

export { CheckBox };
