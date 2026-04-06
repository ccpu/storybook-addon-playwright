import { EditScreenshotAlert } from '../../../src/components/preview/EditScreenshotAlert';
import { shallow } from 'enzyme';
import React from 'react';
import { useEditScreenshot } from '../../../src/features/screenshot/hooks/use-edit-screenshot';
import { Alert } from '@material-ui/lab';
import { Button } from '@material-ui/core';

vi.mock(
  '../../../src/features/screenshot/hooks/use-edit-screenshot',
  async () =>
    await import(
      '../../features/screenshot/hooks/__mocks__/use-edit-screenshot'
    ),
);

describe('EditScreenshotAlert', () => {
  it('should render nothing when editScreenshotState is not defined', () => {
    const wrapper = shallow(<EditScreenshotAlert />);
    expect(wrapper.type()).toBe(null);
  });

  it('should render alert and remove', () => {
    const clearScreenshotEditMock = vi.fn();

    (useEditScreenshot as Mock).mockImplementationOnce(() => ({
      clearScreenshotEdit: clearScreenshotEditMock,
      editScreenshotState: {
        screenshotData: { browserType: 'chromium', title: 'title' },
      },
    }));

    const wrapper = shallow(<EditScreenshotAlert />);

    expect(wrapper.find(Alert)).toHaveLength(1);
    expect(wrapper.find(Alert).text()).toBe(
      `Editing 'title' screenshot (chromium).Cancel`,
    );

    wrapper
      .find(Button)
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(clearScreenshotEditMock).toHaveBeenCalledTimes(1);
  });
});
