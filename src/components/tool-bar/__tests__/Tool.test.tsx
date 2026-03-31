import { Tool } from '../Tool';
import { shallow } from 'enzyme';
import React from 'react';
import WebOutlined from '@material-ui/icons/Launch';
import { PreviewDialog } from '../../screenshot-preview';
import { LayoutBottom, LayoutRight } from '../../../icons';
import { useAddonState } from '../../../hooks//use-addon-state';
import { useStorybookState } from '@storybook/manager-api';

vi.mock('../../../hooks/use-addon-state.ts');
vi.mock('../../../hooks/use-current-story-data.ts');

describe('Tool', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<Tool />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should open/hide screenshot preview dialog', () => {
    const wrapper = shallow(<Tool />);

    const previewIcon = wrapper.find(WebOutlined).parent();
    previewIcon.props().onClick();

    expect(wrapper.find(PreviewDialog).props().open).toBeTruthy();

    wrapper.find(PreviewDialog).props().onClose();

    expect(wrapper.find(PreviewDialog).props().open).toBeFalsy();
  });

  it('should enable browser preview panel', () => {
    const setAddonStateMock = vi.fn();

    (useAddonState as Mock).mockImplementationOnce(() => {
      return {
        addonState: {},
        setAddonState: setAddonStateMock,
      };
    });

    const wrapper = shallow(<Tool />);

    const previewIcon = wrapper.find(LayoutBottom).parent();
    previewIcon.props().onClick();
    expect(setAddonStateMock).toHaveBeenCalledWith({
      previewPanelEnabled: true,
    });
  });

  it('should show LayoutRight', () => {
    (useStorybookState as Mock).mockImplementationOnce(() => ({
      layout: { panelPosition: 'bottom' },
    }));

    const wrapper = shallow(<Tool />);

    expect(wrapper.find(LayoutRight)).toHaveLength(1);
  });
});
