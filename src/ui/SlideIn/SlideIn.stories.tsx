import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { SlideIn } from './SlideIn';

export default {
  title: 'ui/SlideIn',
  component: SlideIn,
  argTypes: {},
} as ComponentMeta<typeof SlideIn>;

const slideInId = 'slide-in-control';

const Template: ComponentStory<typeof SlideIn> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-controls={slideInId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide the cats!' : 'Show me cats!'}
      </button>
      <SlideIn id={slideInId} isOpen={isOpen}>
        <img src="http://placekitten.com/200/300" alt="Some placed kitten" />
      </SlideIn>
    </>
  );
};

export const Default = Template.bind({});
