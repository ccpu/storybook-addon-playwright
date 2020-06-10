import { ScreenshotOptions } from '../ScreenshotOptions';
import { shallow } from 'enzyme';
import React from 'react';
import { TextField } from '@material-ui/core';

describe('ScreenshotOptions', () => {
  it('should render', () => {
    const wrapper = shallow(<ScreenshotOptions onChange={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have defaults', () => {
    const wrapper = shallow(
      <ScreenshotOptions
        onChange={jest.fn()}
        options={{ clip: { height: 1, width: 2, x: 3, y: 4 } }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should set clip width', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    wrapper
      .find(TextField)
      .first()
      .props()
      .onChange(({
        target: { name: 'width', value: 1 },
      } as unknown) as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    expect(changeMock).toHaveBeenCalledWith({ clip: { width: 1 } });
  });

  it('should set clip height', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    wrapper
      .find(TextField)
      .at(1)
      .props()
      .onChange(({
        target: { name: 'height', value: 1 },
      } as unknown) as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    expect(changeMock).toHaveBeenCalledWith({ clip: { height: 1 } });
  });

  it('should set clip x', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    wrapper
      .find(TextField)
      .at(2)
      .props()
      .onChange(({
        target: { name: 'x', value: 1 },
      } as unknown) as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    expect(changeMock).toHaveBeenCalledWith({ clip: { x: 1 } });
  });

  it('should set clip y', () => {
    const changeMock = jest.fn();
    const wrapper = shallow(<ScreenshotOptions onChange={changeMock} />);
    wrapper
      .find(TextField)
      .at(3)
      .props()
      .onChange(({
        target: { name: 'y', value: 1 },
      } as unknown) as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    expect(changeMock).toHaveBeenCalledWith({ clip: { y: 1 } });
  });
});
