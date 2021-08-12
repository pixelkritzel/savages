import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Select } from './Select';
import { useState } from 'react';

export default {
  title: 'UI/Select',
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = ({ ...args }) => {
  const [value, setValue] = useState<string | undefined>('');
  return (
    <Select
      value={value}
      onValueChange={(value) => setValue(value)}
      options={[
        { label: 'Please select an option', value: '' },
        { label: 'Option 1', value: '0' },
        { label: 'Option 2', value: '1' },
      ]}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
