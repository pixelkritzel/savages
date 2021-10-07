import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';

import { ComboBox } from './ComboBox';

export default {
  title: 'ui/ComboBox',
  component: ComboBox,
  argTypes: {},
} as ComponentMeta<typeof ComboBox>;

const labelId = 'combobox-label-id';

const Template: ComponentStory<typeof ComboBox> = (args) => (
  <>
    <FormGroup
      label="Search here"
      id={labelId}
      input={({ id }) => <ComboBox id={id} {...args} />}
      direction="column"
    />
  </>
);

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
  labelId,
  placeholder: 'Search here',
};
