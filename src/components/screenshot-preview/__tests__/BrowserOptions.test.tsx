import '../../../../__manual_mocks__/react-useEffect';
import { BrowserOptions } from '../BrowserOptions';
import { shallow } from 'enzyme';
import React from 'react';
import { useBrowserOptions } from '../../../hooks/use-browser-options';
import { mocked } from 'ts-jest/utils';
import { MemoizedSchemaFormLoader } from '../..';
import { OptionPopover } from '../OptionPopover';

jest.mock('../../../hooks/use-browser-options.ts');
const setBrowserOptionsMock = jest.fn();
const setBrowserDeviceOptionsMock = jest.fn();
mocked(useBrowserOptions).mockImplementation(() => ({
  browserOptions: {},
  getBrowserOptions: jest.fn(),
  hasOption: false,
  setBrowserDeviceOptions: setBrowserDeviceOptionsMock,
  setBrowserOptions: setBrowserOptionsMock,
}));

describe('BrowserOptions', () => {
  it('should render', () => {
    const wrapper = shallow(<BrowserOptions browserType="all" />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should not render', () => {
    mocked(useBrowserOptions).mockImplementationOnce(() => ({
      browserOptions: undefined,
      getBrowserOptions: jest.fn(),
      hasOption: false,
      setBrowserDeviceOptions: jest.fn(),
      setBrowserOptions: setBrowserOptionsMock,
    }));
    const wrapper = shallow(<BrowserOptions browserType="all" />);
    expect(wrapper.find(OptionPopover).exists()).toBeFalsy();
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

    const FooterComponent = wrapper.find(MemoizedSchemaFormLoader).props()
      .FooterComponent;

    expect(FooterComponent).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    FooterComponent.props.onDeviceSelect('iphone 6');

    expect(setBrowserDeviceOptionsMock).toHaveBeenCalledWith('all', 'iphone 6');
  });
});
