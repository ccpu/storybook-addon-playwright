import { ScreenshotOptions } from '../ScreenshotOptions';
import { shallow } from 'enzyme';
import React from 'react';
import { useScreenshotOptions } from '../../../hooks/use-screenshot-options';
import { mocked } from 'ts-jest/utils';
import { MemoizedSchemaFormLoader } from '../..';

jest.mock('../../../hooks/use-screenshot-options.ts');
const setScreenshotOptionsMock = jest.fn();
mocked(useScreenshotOptions).mockImplementation(() => ({
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
    wrapper.find(MemoizedSchemaFormLoader).props().onSave({ data: 1 });
    expect(setScreenshotOptionsMock).toHaveBeenCalledWith({ data: 1 });
  });
});
