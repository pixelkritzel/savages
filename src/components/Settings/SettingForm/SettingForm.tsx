import React, { useContext } from 'react';

import { observer } from 'mobx-react';
import { Flex, Grid, Span } from 'ui/Grid';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

import { Isetting } from 'store/settings';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { Checkbox } from 'ui/Checkbox';
import { Resources } from './Resources';

interface SettingFormProps {
  title: string;
  setting: Isetting;
  saveSetting: () => void;
  discardSetting: () => void;
}

export const SettingForm = observer(function SettingFormFn({
  setting,
  title,
  saveSetting,
  discardSetting,
  ...otherProps
}: SettingFormProps) {
  const store = useContext<Istore>(StoreContext);

  return (
    <Grid as="form">
      <Span as="h1">Setting Form</Span>
      <Span>
        <FormGroup
          label="Setting name"
          input={({ id }) => (
            <Input
              id={id}
              value={setting.name}
              onValueChange={(value) => setting.set('name', value)}
            />
          )}
        />
      </Span>
      <Span as="hr"></Span>
      <Span as="h2">Creation Rules</Span>
      <Span>
        <Checkbox
          label="Born A Hero"
          checked={setting.creation.isBornHero}
          onChange={() => setting.creation.set('isBornHero', !setting.creation.isBornHero)}
        />
      </Span>
      <Span start={1} end={7}>
        <FormGroup
          label="Attribute Points"
          input={({ id }) => (
            <Input
              id={id}
              type="number"
              min={0}
              step={1}
              value={setting.creation.attributePoints}
              onValueChange={(value) => setting.creation.set('attributePoints', Number(value))}
            />
          )}
        />
      </Span>
      <Span start={7} end={13}>
        <FormGroup
          label="Skill Points"
          input={({ id }) => (
            <Input
              id={id}
              type="number"
              min={0}
              step={1}
              value={setting.creation.skillPoints}
              onValueChange={(value) => setting.creation.set('skillPoints', Number(value))}
            />
          )}
        />
      </Span>
      <Span as="hr"></Span>
      <Span as="h2"> Races</Span>
      <Span as="hr"></Span>
      <Resources
        name="hindrace"
        availableSettingResources={setting.availableHindrances}
        resourcesFromStore={store.hindrances}
      />
      <Span as="hr" />
      <Resources
        name="edge"
        availableSettingResources={setting.availableEdges}
        resourcesFromStore={store.edges}
      />
      <Span as="hr" />
      <Resources
        name="skill"
        availableSettingResources={setting.availableSkills}
        resourcesFromStore={store.skills}
      />
    </Grid>
  );
});
