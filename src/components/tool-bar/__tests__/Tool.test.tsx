import { Tool } from '../Tool';
import { shallow } from 'enzyme';
import React from 'react';
import WebOutlined from '@mui/icons-material/Launch';
import { PreviewDialog } from '../../screenshot-preview';
import { LayoutBottom, LayoutRight } from '../../../icons';
import { useAddonState } from '../../../hooks//use-addon-state';
import { useStorybookState } from '@storybook/api';

jest.mock('../../../hooks/use-addon-state.ts');
jest.mock('../../../hooks/use-current-story-data.ts');

describe('Tool', () => {
  beforeAll(() => {
    jest.clearAllMocks();
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
    const setAddonStateMock = jest.fn();

    (useAddonState as jest.Mock).mockImplementationOnce(() => {
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
    (useStorybookState as jest.Mock).mockImplementationOnce(() => ({
      layout: { panelPosition: 'bottom' },
    }));

    const wrapper = shallow(<Tool />);

    expect(wrapper.find(LayoutRight)).toHaveLength(1);
  });
});
