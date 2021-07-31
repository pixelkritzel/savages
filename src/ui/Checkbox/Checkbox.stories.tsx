import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { Checkbox } from './Checkbox';

export default {
  title: 'ui/Checkbox',
  component: Checkbox,
  argTypes: {},
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => {
  const [value, setValue] = useState(true);
  return <Checkbox checked={value} onChange={() => setValue(!value)} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Click Me',
};
