import { ActionDialog } from '../ActionDialog';
import { shallow } from 'enzyme';
import React from 'react';

import { Dialog } from '../Dialog';
describe('ActionDialog', () => {
  const onCloseMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ActionDialog open={true} onClose={onCloseMock} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle close', () => {
    const wrapper = shallow(<ActionDialog open={true} onClose={onCloseMock} />);

    wrapper.find(Dialog).props().onClose();

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should handle cancel', () => {
    const onCancelMock = jest.fn();
    const wrapper = shallow(
      <ActionDialog
        open={true}
        onClose={onCloseMock}
        onCancel={onCancelMock}
      />,
    );
    wrapper.find(Dialog).props().onClose();

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
