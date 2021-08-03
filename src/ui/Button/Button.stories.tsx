import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AiOutlineAlert } from 'react-icons/ai';

import { Button } from './Button';

export default {
  title: 'ui/Button',
  component: Button,
  argTypes: {},
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Click Me',
};

export const BigButton = Template.bind({});
BigButton.args = {
  children: 'Click Me',
  size: 'big',
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Click Me',
  variant: 'danger',
};

export const Success = Template.bind({});
Success.args = {
  children: 'Click Me',
  variant: 'success',
};

export const PseudoLink = Template.bind({});
PseudoLink.args = {
  children: 'Click Me',
  variant: 'link',
};

export const LinkStyledAsButton = Template.bind({});
LinkStyledAsButton.args = {
  children: 'Click Me',
  as: 'a',
  href: '#',
};

export const IconButton = Template.bind({});
IconButton.args = {
  variant: 'icon',
  children: <AiOutlineAlert />,
};

export const IconButtonWithIcon = Template.bind({});
IconButtonWithIcon.args = {
  variant: 'icon',
  icon: <AiOutlineAlert />,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: 'Click Me',
  variant: 'danger',
  icon: <AiOutlineAlert />,
};
