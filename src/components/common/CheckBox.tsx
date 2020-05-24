import React, { SFC } from 'react';
import { IconButton } from '@material-ui/core';
import CheckBoxUnchecked from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxChecked from '@material-ui/icons/CheckBox';

export interface CheckBoxProps {
  onClick: () => void;
  checked: boolean;
}

const CheckBox: SFC<CheckBoxProps> = (props) => {
  const { onClick, checked } = props;

  return (
    <IconButton className="check-box" onClick={onClick} size="small">
      {checked ? <CheckBoxChecked /> : <CheckBoxUnchecked />}
    </IconButton>
  );
};

CheckBox.displayName = 'CheckBox';

export { CheckBox };
