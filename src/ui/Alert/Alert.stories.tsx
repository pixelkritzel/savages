import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Alert } from './Alert';

export default {
  title: 'UI/Alert',
  component: Alert,
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = ({ ...args }) => {
  return <Alert>Something irritating happened</Alert>;
};

export const Default = Template.bind({});
Default.args = {};
