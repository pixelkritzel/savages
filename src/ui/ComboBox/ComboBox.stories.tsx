import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { FormGroup } from 'ui/FormGroup';
import supervillains from 'supervillains';

import { ComboBox } from './ComboBox';

export default {
  title: 'ui/ComboBox',
  component: ComboBox,
  argTypes: {},
} as ComponentMeta<typeof ComboBox>;

const labelId = 'combobox-label-id';

const items = Array.from({ length: 20 }, (_, index) => ({
  value: index.toString(),
  display: `${index + 1} - ${
    supervillains.all[Math.floor(Math.random() * supervillains.all.length)]
  }`,
}));

const Template: ComponentStory<typeof ComboBox> = (args) => {
  const [results, setResult] = useState<[string, number][]>([]);

  return (
    <div
      style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <FormGroup
          label="Search here"
          id={labelId}
          input={({ id }) => (
            <ComboBox
              id={id}
              noResultsMessage="No villains available"
              onValueSelect={(value, index) => setResult([...results, [value, index]])}
              {...args}
            />
          )}
          direction="column"
        />
        <ol>
          {results.map(([value, itemIndex], index) => (
            <li key={index}>
              Selected {value} with label <code>{items[itemIndex].display}</code>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <FormGroup
          label="Search here"
          id={labelId + '2'}
          input={({ id }) => (
            <ComboBox
              id={id}
              onValueSelect={(value, index) => setResult([...results, [value, index]])}
              {...args}
            />
          )}
          direction="column"
        />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  items,
  labelId,
  placeholder: 'Search here',
};
