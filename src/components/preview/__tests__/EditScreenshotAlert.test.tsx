import { EditScreenshotAlert } from '../EditScreenshotAlert';
import { shallow } from 'enzyme';
import React from 'react';
import { useEditScreenshot } from '../../../hooks//use-edit-screenshot';
import { Alert } from '@mui/material';
import { Button } from '@mui/material';

jest.mock('../../../hooks//use-edit-screenshot');

describe('EditScreenshotAlert', () => {
  it('should render nothing when editScreenshotState is not defined', () => {
    const wrapper = shallow(<EditScreenshotAlert />);
    expect(wrapper.type()).toBe(null);
  });

  it('should render alert and remove', () => {
    const clearScreenshotEditMock = jest.fn();

    (useEditScreenshot as jest.Mock).mockImplementationOnce(() => ({
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
