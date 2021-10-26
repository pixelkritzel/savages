import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';

import { SlideIn } from './SlideIn';

export default {
  title: 'ui/SlideIn',
  component: SlideIn,
  argTypes: {},
} as ComponentMeta<typeof SlideIn>;

const slideInId1 = 'slide-in-control-1';
const slideInId2 = 'slide-in-control-2';

const Template: ComponentStory<typeof SlideIn> = (args) => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  return (
    <>
      <button
        aria-expanded={isOpen1}
        aria-controls={slideInId1}
        type="button"
        onClick={() => setIsOpen1(!isOpen1)}
      >
        {isOpen1 ? 'Close Slider' : 'Open Slider'}
      </button>

      <button
        aria-expanded={isOpen2}
        aria-controls={slideInId2}
        type="button"
        onClick={() => setIsOpen2(!isOpen2)}
      >
        {isOpen2 ? 'Hide the cats!' : 'Show me cats!'}
      </button>

      <SlideIn
        id={slideInId1}
        isOpen={isOpen1}
        slide={<>Open the second slider to see cats</>}
        slideTitle="Initially Open SlideIn"
      />
      <SlideIn
        id={slideInId2}
        isOpen={isOpen2}
        slide={<img src="http://placekitten.com/200/300" alt="Some placed kitten" />}
        slideTitle="Morle was a black cat"
      />
    </>
  );
};

export const Default = Template.bind({});
