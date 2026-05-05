import { PreviewPlacementMenu } from '../../../src/components/tool-bar/PreviewPlacementMenu';
import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { Menu, MenuItem } from '@material-ui/core';
import { useAddonState } from '../../../src/hooks/use-addon-state';

vi.mock(
  '../../../src/hooks/use-addon-state',
  async () => await import('../../hooks/__mocks__/use-addon-state'),
);

describe('PreviewPlacementMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<PreviewPlacementMenu />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show/hide placement review', () => {
    const wrapper = shallow(<PreviewPlacementMenu />);

    const placementButton = wrapper.find(IconButton);

    placementButton
      .props()
      .onClick?.({ currentTarget: { nodeName: 'div' } } as never);

    expect(wrapper.find(Menu).props().anchorEl).not.toBe(null);

    wrapper.find(Menu).props().onClose?.({}, 'backdropClick');

    expect(wrapper.find(Menu).props().anchorEl).toBe(null);
  });

  it('should handle menu item click', () => {
    const wrapper = shallow(<PreviewPlacementMenu />);

    const setAddonStateMock = vi.fn();

    (useAddonState as Mock).mockImplementation(() => {
      return {
        addonState: {},
        setAddonState: setAddonStateMock,
      };
    });

    const placementButton = wrapper.find(IconButton);

    placementButton
      .props()
      .onClick?.({ currentTarget: { nodeName: 'div' } } as never);

    const menuItem = wrapper.find(MenuItem);

    menuItem
      .first()
      .props()
      .onClick?.({
        currentTarget: { dataset: { placement: 'Auto' } },
      } as unknown as React.MouseEvent<HTMLLIElement, MouseEvent>);

    expect(setAddonStateMock).toHaveBeenCalledWith({ placement: 'Auto' });
  });
});
