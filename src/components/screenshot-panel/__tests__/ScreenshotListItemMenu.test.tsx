import { ScreenshotListItemMenu } from '../ScreenshotListItemMenu';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from './data';
import EditIcon from '@material-ui/icons/Edit';
import { useEditScreenshot } from '../../../hooks/use-edit-screenshot';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import { ScreenshotUpdate } from '../ScreenshotUpdate';
import Compare from '@material-ui/icons/Compare';
import { ScreenshotDelete } from '../ScreenshotDelete';
import { ScreenshotInfo } from '../ScreenshotInfo';

jest.mock('../../../hooks/use-edit-screenshot');

describe('ScreenshotListItemMenu', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu screenshot={getScreenshotDate()} />,
    );
    expect(wrapper.exists()).toBeTruthy();

    const delComp = wrapper.find(ScreenshotDelete);
    expect(delComp).toHaveLength(1);

    const InfComp = wrapper.find(ScreenshotInfo);
    expect(InfComp).toHaveLength(1);
  });

  it('should have edit icon', () => {
    const editMock = jest.fn();
    (useEditScreenshot as jest.Mock).mockImplementationOnce(() => {
      return {
        clearScreenshotEdit: jest.fn(),
        editScreenshot: editMock,
      };
    });

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        enableEditScreenshot
      />,
    );
    const editIcon = wrapper.find(EditIcon);

    expect(editIcon).toHaveLength(1);

    editIcon
      .parent()
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(editMock).toHaveBeenCalledTimes(1);
  });

  it('should render load screenshot setting into storybook icon', () => {
    const funcMock = jest.fn();
    (useEditScreenshot as jest.Mock).mockImplementationOnce(() => {
      return {
        clearScreenshotEdit: jest.fn(),
        loadSetting: funcMock,
      };
    });

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        enableLoadSetting
      />,
    );
    const icon = wrapper.find(SystemUpdateAltIcon);

    expect(icon).toHaveLength(1);

    icon
      .parent()
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(funcMock).toHaveBeenCalledTimes(1);
  });

  it('should render update component', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu screenshot={getScreenshotDate()} enableUpdate />,
    );
    const screenshotUpdate = wrapper.find(ScreenshotUpdate);

    expect(screenshotUpdate).toHaveLength(1);
  });

  it('should render image diff icon', () => {
    const funcMock = jest.fn();

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        enableImageDiff
        onRunImageDiff={funcMock}
      />,
    );

    const icon = wrapper.find(Compare);

    expect(icon).toHaveLength(1);

    icon
      .parent()
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(funcMock).toHaveBeenCalledTimes(1);
  });
});
