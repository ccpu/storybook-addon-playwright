import { ScreenshotOptions } from '../../../../../src/features/screenshot/components/screenshot-preview/ScreenshotOptions';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotOptions } from '../../../../../src/features/screenshot/hooks/use-screenshot-options';
import { SchemaFormLoader } from '../../../../../src/components/common/SchemaFormLoader';

vi.mock(
  '../../../../../src/features/screenshot/hooks/use-screenshot-options',
  async () => await import('../../hooks/__mocks__/use-screenshot-options'),
);
const setScreenshotOptionsMock = vi.fn();
vi.mocked(useScreenshotOptions).mockImplementation(() => ({
  screenshotOptions: {},
  setScreenshotOptions: setScreenshotOptionsMock,
}));

describe('ScreenshotOptions', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotOptions />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle save', () => {
    const wrapper = shallow(<ScreenshotOptions />);
    wrapper.find(SchemaFormLoader).props().onSave({ data: 1 });
    expect(setScreenshotOptionsMock).toHaveBeenCalledWith({ data: 1 });
  });
});
