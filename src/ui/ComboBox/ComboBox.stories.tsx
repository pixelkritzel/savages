import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ComboBox } from './ComboBox';

export default {
  title: 'ui/ComboBox',
  component: ComboBox,
  argTypes: {},
} as ComponentMeta<typeof ComboBox>;

const Template: ComponentStory<typeof ComboBox> = (args) => <ComboBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      value: '0',
      display: 'The null',
    },
    {
      value: '1',
      display: { component: <span>👩‍🚀 One Astronaut </span>, searchableText: 'One Astronaut' },
    },
  ],
  label: 'ComboBox Example',
};
