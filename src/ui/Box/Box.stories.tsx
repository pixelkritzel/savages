import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from './Box';

export default {
  title: 'UI/Box',
  component: Box,
} as ComponentMeta<typeof Box>;

const Template: ComponentStory<typeof Box> = ({ ...args }) => {
  return <Box {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: 'This is an info',
  children: 'Did you know?',
};

export const ExplicitInfo = Template.bind({});
ExplicitInfo.args = {
  title: 'This is an explicit info',
  children: 'Did you know?',
  type: 'info',
};

export const Success = Template.bind({});
Success.args = {
  title: 'SUCCESS!',
  children: 'Well done',
  type: 'success',
};

export const Warning = Template.bind({});
Warning.args = {
  title: 'Attention!',
  children: 'This  might be a problem',
  type: 'warning',
};

export const WarningAsFielset = Template.bind({});
WarningAsFielset.args = {
  title: 'There are errors',
  children: 'This is a fielset with problems',
  type: 'warning',
  asFieldset: true,
};

export const Danger = Template.bind({});
Danger.args = {
  title: 'Impending doom',
  children: "This can't be undone",
  type: 'danger',
};
