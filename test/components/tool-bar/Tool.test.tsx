import { Tool } from '../../../src/components/tool-bar/Tool';
import { shallow } from 'enzyme';
import React from 'react';
import { PreviewDialog } from '../../../src/features/screenshot/components/screenshot-preview/index';
import { TooltipLinkList, WithTooltip } from '@storybook/components';
import { SidebarAltIcon } from '@storybook/icons';
import { useAddonState } from '../../../src/hooks/use-addon-state';

vi.mock(
  '../../../src/hooks/use-addon-state',
  async () => await import('../../hooks/__mocks__/use-addon-state'),
);
vi.mock(
  '../../../src/hooks/use-current-story-data',
  async () => await import('../../hooks/__mocks__/use-current-story-data'),
);

const getToolContentWrapper = () => {
  const wrapper = shallow(<Tool />);
  return shallow(wrapper.props().children as React.ReactElement);
};

const getTooltipWrapper = (wrapper: ReturnType<typeof shallow>) => {
  const tooltipProp = wrapper.find(WithTooltip).at(0).props().tooltip as (args: {
    onHide: () => void;
  }) => React.ReactNode;

  return shallow(<div>{tooltipProp({ onHide: vi.fn() })}</div>);
};

describe('Tool', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<Tool />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should open/hide screenshot preview dialog', () => {
    const wrapper = getToolContentWrapper();
    const tooltipWrapper = getTooltipWrapper(wrapper);
    const links = tooltipWrapper.find(TooltipLinkList).props().links as Array<{
      id: string;
      onClick?: () => void;
    }>;

    links.find((link) => link.id === 'full-screen')?.onClick?.();
    wrapper.update();

    expect(wrapper.find(PreviewDialog).props().open).toBeTruthy();

    wrapper.find(PreviewDialog).props().onClose();
    wrapper.update();

    expect(wrapper.find(PreviewDialog)).toHaveLength(0);
  });

  it('should enable browser preview panel', () => {
    const setAddonStateMock = vi.fn();

    (useAddonState as Mock).mockImplementationOnce(() => {
      return {
        addonState: {},
        setAddonState: setAddonStateMock,
      };
    });

    const wrapper = getToolContentWrapper();
    const tooltipWrapper = getTooltipWrapper(wrapper);
    const links = tooltipWrapper.find(TooltipLinkList).props().links as Array<{
      id: string;
      onClick?: () => void;
    }>;

    links.find((link) => link.id === 'panel-toggle')?.onClick?.();

    expect(setAddonStateMock).toHaveBeenCalledWith({
      previewPanelEnabled: true,
    });
  });

  it('should show SidebarAltIcon', () => {
    (useAddonState as Mock).mockImplementationOnce(() => ({
      addonState: {
        placement: 'right',
        previewPanelEnabled: false,
      },
      setAddonState: vi.fn(),
    }));

    const wrapper = getToolContentWrapper();
    const tooltipWrapper = getTooltipWrapper(wrapper);
    const links = tooltipWrapper.find(TooltipLinkList).props().links as Array<{
      id: string;
      content?: React.ReactNode;
    }>;
    const content = links.find((link) => link.id === 'position')
      ?.content as React.ReactElement<{
      children: React.ReactElement<{ icon: React.ReactElement }>;
    }>;

    expect(content.props.children.props.icon.type).toBe(SidebarAltIcon);
  });
});
