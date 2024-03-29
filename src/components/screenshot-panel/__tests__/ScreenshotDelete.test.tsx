import '../../../../__manual_mocks__/react-useEffect';
import { ScreenshotDelete } from '../ScreenshotDelete';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../__test_data__/get-screenshot-date';
import { useDeleteScreenshot } from '../../../hooks/use-delete-screenshot';
import { DeleteConfirmationButton } from '../../common';

jest.mock('../../../hooks/use-delete-screenshot');
const useDeleteScreenshotMock = useDeleteScreenshot as jest.Mock;
const onDeleteMock = jest.fn();

describe('ScreenshotDelete', () => {
  it('should render', () => {
    const stateMock = jest.fn();
    const wrapper = shallow(
      <ScreenshotDelete
        screenshot={getScreenshotDate()}
        onClose={jest.fn()}
        onStateChange={stateMock}
        onDelete={onDeleteMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(stateMock).toHaveBeenCalledWith(false);
  });

  it('should delete', () => {
    const deleteMock = jest.fn();
    useDeleteScreenshotMock.mockImplementationOnce(() => {
      return {
        ErrorSnackbar: () => undefined,
        deleteScreenshot: deleteMock,
      };
    });

    const wrapper = shallow(
      <ScreenshotDelete
        screenshot={getScreenshotDate()}
        onClose={jest.fn()}
        onStateChange={jest.fn()}
        onDelete={onDeleteMock}
      />,
    );

    const dialog = wrapper.find(DeleteConfirmationButton);
    dialog.props().onDelete();
    expect(dialog).toBeDefined();
    expect(deleteMock).toHaveBeenCalledWith('screenshot-id');
    expect(onDeleteMock).toHaveBeenCalled();
  });
});
