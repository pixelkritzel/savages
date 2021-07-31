import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Table } from './Table';

export default {
  title: 'ui/Table',
  component: Table,
  argTypes: {},
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <thead>
        <tr>
          <th>Name</th>
          <th>Nickname</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Donald</td>
          <td>Donnie</td>
        </tr>
        <tr>
          <td>Michael</td>
          <td>Meek</td>
        </tr>
        <tr>
          <td>Charles</td>
          <td>Charlie</td>
        </tr>
      </tbody>
    </>
  ),
};
