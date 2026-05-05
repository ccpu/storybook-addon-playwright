import '../../../../manual-mocks/react-useEffect';
import { BrowserOptions } from '../../../../../src/features/screenshot/components/screenshot-preview/BrowserOptions';
import { shallow } from 'enzyme';
import React from 'react';
import {
  BrowsersOption,
  useBrowserOptions,
} from '../../../../../src/hooks/use-browser-options';
import { MemoizedSchemaFormLoader } from '../../../../../src/components';
import { OptionPopover } from '../../../../../src/features/screenshot/components/screenshot-preview/OptionPopover';

vi.mock(
  '../../../../../src/hooks/use-browser-options',
  async () => await import('../../../../hooks/__mocks__/use-browser-options'),
);
const setBrowserOptionsMock = vi.fn();
const setBrowserDeviceOptionsMock = vi.fn();
vi.mocked(useBrowserOptions).mockImplementation(() => ({
  browserOptions: {},
  getBrowserOptions: vi.fn(),
  hasOption: false,
  setBrowserDeviceOptions: setBrowserDeviceOptionsMock,
  setBrowserOptions: setBrowserOptionsMock,
}));

describe('BrowserOptions', () => {
  it('should render', () => {
    const wrapper = shallow(<BrowserOptions browserType="all" />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should return null when browser options are missing', () => {
    vi.mocked(useBrowserOptions).mockImplementationOnce(() => ({
      browserOptions: undefined as unknown as BrowsersOption,
      getBrowserOptions: vi.fn(),
      hasOption: false,
      setBrowserDeviceOptions: vi.fn(),
      setBrowserOptions: setBrowserOptionsMock,
    }));
    const wrapper = shallow(<BrowserOptions browserType="all" />);
    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('should pass browser options as default data', () => {
    vi.mocked(useBrowserOptions).mockImplementationOnce(() => ({
      browserOptions: {
        all: { cursor: true },
      },
      getBrowserOptions: vi.fn(),
      hasOption: true,
      setBrowserDeviceOptions: vi.fn(),
      setBrowserOptions: setBrowserOptionsMock,
    }));

    const wrapper = shallow(<BrowserOptions browserType="all" />);

    expect(wrapper.find(OptionPopover).prop('active')).toBeTruthy();
    expect(wrapper.find(MemoizedSchemaFormLoader).prop('defaultData')).toEqual({
      cursor: true,
    });
  });

  it('should handle save', () => {
    const wrapper = shallow(<BrowserOptions browserType="all" />);
    wrapper.find(MemoizedSchemaFormLoader).props().onSave({ type: 'MyType' });
    expect(setBrowserOptionsMock).toHaveBeenCalledWith('all', {
      type: 'MyType',
    });
  });

  it('should handleDeviceSelection', () => {
    const wrapper = shallow(<BrowserOptions browserType="all" />);

    const FooterComponent = wrapper
      .find(MemoizedSchemaFormLoader)
      .props().FooterComponent;

    expect(FooterComponent).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    FooterComponent.props.onDeviceSelect('iphone 6');

    expect(setBrowserDeviceOptionsMock).toHaveBeenCalledWith('all', 'iphone 6');
  });
});
