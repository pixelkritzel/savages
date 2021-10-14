import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { SlightIn } from './SlightIn';

export default {
  title: 'ui/SlightIn',
  component: SlightIn,
  argTypes: {},
} as ComponentMeta<typeof SlightIn>;

const slightInId = 'slight-in-control';

const Template: ComponentStory<typeof SlightIn> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-controls={slightInId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide the cats!' : 'Show me cats!'}
      </button>
      <SlightIn id={slightInId} isOpen={isOpen}>
        <img src="http://placekitten.com/200/300" alt="Some placed kitten" />
      </SlightIn>
    </>
  );
};

export const Default = Template.bind({});
