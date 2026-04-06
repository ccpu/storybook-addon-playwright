import { ScreenshotListItemMenu } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotListItemMenu';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../configs/get-screenshot-date';
import EditIcon from '@material-ui/icons/Edit';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import { ScreenshotUpdate } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotUpdate';
import Compare from '@material-ui/icons/Compare';
import { ScreenshotDelete } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotDelete';
import { ScreenshotInfo } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotInfo';

const onDeleteMock = vi.fn();

describe('ScreenshotListItemMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();

    const delComp = wrapper.find(ScreenshotDelete);
    expect(delComp).toHaveLength(1);

    const InfComp = wrapper.find(ScreenshotInfo);
    expect(InfComp).toHaveLength(1);
  });

  it('should have edit icon', () => {
    const editMock = vi.fn();

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onEditClick={editMock}
        onDelete={onDeleteMock}
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
    const editMock = vi.fn();

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
        onLoadSettingClick={editMock}
        enableLoadSetting
      />,
    );
    const icon = wrapper.find(SystemUpdateAltIcon);

    expect(icon).toHaveLength(1);

    icon
      .parent()
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(editMock).toHaveBeenCalledTimes(1);
  });

  it('should render update component', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
        enableUpdate
      />,
    );
    const screenshotUpdate = wrapper.find(ScreenshotUpdate);

    expect(screenshotUpdate).toHaveLength(1);
  });

  it('should render image diff icon', () => {
    const funcMock = vi.fn();

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
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

  it('should call on delete', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();

    const delComp = wrapper.find(ScreenshotDelete);

    delComp.props().onDelete();

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
