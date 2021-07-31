import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Popover } from './Popover';

export default {
  title: 'ui/Popover',
  component: Popover,
  argTypes: {},
} as ComponentMeta<typeof Popover>;

const Template: ComponentStory<typeof Popover> = (args) => <Popover {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: (
    <div>
      <p>
        Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac,
        vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
        lacinia odio sem nec elit. Cum sociis natoque penatibus et magnis dis parturient montes,
        nascetur ridiculus mus.
      </p>
      <p>
        Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Donec sed odio
        dui. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus,
        nisi erat porttitor ligula, eget lacinia odio sem nec elit.
      </p>
    </div>
  ),
  children: <span>Hover me</span>,
};
