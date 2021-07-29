import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { IncDec } from './IncDec';
import { useState } from 'react';

export default {
  title: 'UI/IncDec',
  component: IncDec,
} as ComponentMeta<typeof IncDec>;

const Template: ComponentStory<typeof IncDec> = ({ ...args }) => {
  const [value, setValue] = useState(0);
  return (
    <IncDec
      value={value}
      onDecrement={() => setValue(value - 1)}
      onIncrement={() => setValue(value + 1)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
