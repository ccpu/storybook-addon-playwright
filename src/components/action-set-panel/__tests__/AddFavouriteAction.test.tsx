import { AddFavouriteAction } from '../AddFavouriteAction';
import { shallow } from 'enzyme';
import { ActionSet } from '../../../typings';
import React from 'react';
import { RadioGroup, Button, TextField } from '@material-ui/core';
import { addFavouriteAction } from '../../../api/client/add-favourite-action';

jest.mock('../../../hooks/use-anchor-el');
jest.mock('../../../api/client/add-favourite-action');

const actionSet: ActionSet = {
  actions: [
    {
      id: 'action-id',
      name: 'action-name',
    },
  ],
  id: 'action-set-id',
  title: 'action-set-desc',
  visibleTo: '*',
};

describe('AddFavouriteAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(AddFavouriteAction).toBeDefined();
  });

  it('should render', () => {
    const wrapper = shallow(<AddFavouriteAction item={actionSet} />);

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should action to story parent so it will be accessible in all child stories', () => {
    const wrapper = shallow(<AddFavouriteAction item={actionSet} />);

    const radioGroup = wrapper.find(RadioGroup).last();

    radioGroup
      .props()
      .onChange({} as React.ChangeEvent<HTMLInputElement>, 'parent');

    const saveButton = wrapper.find(Button).first();

    saveButton
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(addFavouriteAction).toHaveBeenCalledWith({
      ...actionSet,
      visibleTo: 'parent',
    });
  });

  it('should set stories via text input', () => {
    const wrapper = shallow(<AddFavouriteAction item={actionSet} />);

    wrapper
      .find(TextField)
      .props()
      .onChange({ target: { value: '^foo' } } as React.ChangeEvent<
        HTMLTextAreaElement | HTMLInputElement
      >);

    const saveButton = wrapper.find(Button).first();

    saveButton
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    expect(addFavouriteAction).toHaveBeenCalledWith({
      ...actionSet,
      visibleTo: '^foo',
    });
  });
});
