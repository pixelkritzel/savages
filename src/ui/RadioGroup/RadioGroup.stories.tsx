import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { RadioGroup } from './RadioGroup';

export default {
  title: 'ui/RadioGroup',
  component: RadioGroup,
  argTypes: {},
} as ComponentMeta<typeof RadioGroup>;

const Template: ComponentStory<typeof RadioGroup> = (args) => {
  const [value, setValue] = useState('');
  return (
    <>
      Pizza toping? <RadioGroup {...args} selectedValue={value} setSelectedValue={setValue} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  radios: [
    ['none', 'None'],
    ['tuna', 'Tuna'],
    ['cheeseXL', 'Extra Cheese'],
    ['peperoni', 'Perperoni'],
  ],
};
