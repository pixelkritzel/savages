import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { Input } from 'ui/Input';

import { FormGroup } from './FormGroup';

export default {
  title: 'ui/FormGroup',
  component: FormGroup,
  argTypes: {},
} as ComponentMeta<typeof FormGroup>;

const Template: ComponentStory<typeof FormGroup> = (args) => {
  const [value, setValue] = useState('');
  return (
    <FormGroup
      {...args}
      input={({ id }) => <Input id={id} value={value} onValueChange={setValue} />}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Change the value',
};

export const Inline = Template.bind({});
Inline.args = {
  label: 'Change the value',
  inline: true,
};
