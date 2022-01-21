import React from 'react';
import { IconButton } from '@mui/material';
import CheckBoxUnchecked from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxChecked from '@mui/icons-material/CheckBox';

export interface CheckBoxProps {
  onClick: () => void;
  checked: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const { onClick, checked } = props;

  return (
    <IconButton
      className="check-box"
      color={checked ? 'primary' : 'default'}
      onClick={onClick}
      size="small"
    >
      {checked ? <CheckBoxChecked /> : <CheckBoxUnchecked />}
    </IconButton>
  );
};

CheckBox.displayName = 'CheckBox';

export { CheckBox };
