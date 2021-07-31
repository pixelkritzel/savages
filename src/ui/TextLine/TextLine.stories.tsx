import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { TextLine } from './TextLine';

export default {
  title: 'ui/TextLine',
  component: TextLine,
  argTypes: {},
} as ComponentMeta<typeof TextLine>;

const Template: ComponentStory<typeof TextLine> = (args) => {
  const [value, setValue] = useState('Berlin');
  return <TextLine label="Where do you live?" value={value} onValueChange={setValue} />;
};

export const Default = Template.bind({});
Default.args = {};
