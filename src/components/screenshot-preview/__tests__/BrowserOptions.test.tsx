import { BrowserOptions } from '../BrowserOptions';
import { shallow } from 'enzyme';
import React from 'react';
import { useBrowserOptions } from '../../../hooks/use-browser-options';
import { mocked } from 'ts-jest/utils';
import { MemoizedSchemaFormLoader } from '../..';
import { OptionPopover } from '../OptionPopover';

jest.mock('../../../hooks/use-browser-options.ts');
const setBrowserOptionsMock = jest.fn();

mocked(useBrowserOptions).mockImplementation(() => ({
  browserOptions: {},
  getBrowserOptions: jest.fn(),
  hasOption: false,
  setBrowserDeviceOptions: jest.fn(),
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
});
