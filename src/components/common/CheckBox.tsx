import React from 'react';

import { FormIcon, StopAltHollowIcon } from '@storybook/icons';
import { IconButton } from '@storybook/components';

export interface CheckBoxProps {
  onClick: () => void;
  checked: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const { onClick, checked } = props;

  return (
    <IconButton
      className="check-box"
      onClick={onClick}
      size="small"
      active={checked}
    >
      {checked ? <FormIcon /> : <StopAltHollowIcon />}
    </IconButton>
  );
};

CheckBox.displayName = 'CheckBox';

export { CheckBox };
