import { Dialog } from '../../../src/components/common/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { shallow } from 'enzyme';
import React from 'react';

describe('Dialog', () => {
  it('should render', () => {
    const wrapper = shallow(<Dialog open={true} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should keep the body inside DialogContent', () => {
    const TitleActions = () => <button type="button">Title action</button>;
    const FooterActions = () => <button type="button">Footer action</button>;

    const wrapper = shallow(
      <Dialog
        open={true}
        title="Dialog title"
        subtitle="Dialog subtitle"
        footerActions={FooterActions}
        titleActions={TitleActions}
      >
        <div>Scrollable body</div>
      </Dialog>,
    );

    expect(wrapper.find(DialogTitle)).toHaveLength(1);
    expect(wrapper.find(DialogContent)).toHaveLength(1);
    expect(wrapper.find(DialogActions)).toHaveLength(1);
    expect(wrapper.find(DialogContent).children().text()).toContain('Scrollable body');
  });
});
