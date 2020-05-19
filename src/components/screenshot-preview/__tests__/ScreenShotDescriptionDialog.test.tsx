import { ScreenShotDescriptionDialog } from '../ScreenShotDescriptionDialog';
import { shallow } from 'enzyme';
import React from 'react';
import * as saveScreenshot from '../../../api/client/save-screenshot';
import { Button, TextField } from '@material-ui/core';

describe('ScreenShotDescriptionDialog', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ScreenShotDescriptionDialog
        browserType="chromium"
        onClose={jest.fn()}
        screenShot="base64-image"
        open={true}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle textarea change', () => {
    const wrapper = shallow(
      <ScreenShotDescriptionDialog
        browserType="chromium"
        onClose={jest.fn()}
        screenShot="base64-image"
        open={true}
      />,
    );

    wrapper
      .find(TextField)
      .props()
      .onChange({ target: { value: 'foo' } } as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >);

    expect(wrapper.find(TextField).props().value).toBe('foo');
  });

  it('should handle save', () => {
    const spyOn = jest.spyOn(saveScreenshot, 'saveScreenshot');
    const wrapper = shallow(
      <ScreenShotDescriptionDialog
        browserType="chromium"
        onClose={jest.fn()}
        screenShot="base64-image"
        open={true}
      />,
    );

    wrapper
      .find(Button)
      .last()
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(spyOn).toHaveBeenCalledTimes(1);
    spyOn.mockRestore();
  });
});
