import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { Input } from './Input';

export default {
  title: 'ui/Input',
  component: Input,
  argTypes: {},
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  const [value, setValue] = useState('');
  return <Input value={value} onValueChange={setValue} />;
};

export const Default = Template.bind({});
Default.args = {};
