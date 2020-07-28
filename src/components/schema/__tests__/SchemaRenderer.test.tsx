import { SchemaRenderer } from '../SchemaRenderer';
import { shallow } from 'enzyme';
import React from 'react';

describe('SchemaRenderer', () => {
  const onChangeMock = jest.fn();

  const getVal = () => {
    return null;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <SchemaRenderer
        onChange={onChangeMock}
        getValue={getVal}
        schemaProps={{ name: 'schema-name' }}
      />,
    );

    expect(wrapper.exists()).toBeTruthy();
  });
});
