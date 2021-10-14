import React from 'react';
import { observer } from 'mobx-react';
import { IRacialAbility } from 'store/racialAbilities';
import { Flex, Grid, Span } from 'ui/Grid';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { Checkbox } from 'ui/Checkbox';
import { Textarea } from 'ui/Textarea';

interface RacialAbilityFormProps {
  children?: React.ReactNode;
  ability: IRacialAbility;
}

export const RacialAbilityForm = observer(function RacialAbilityFormFn({
  ability,
  ...otherProps
}: RacialAbilityFormProps) {
  return (
    <Grid {...otherProps}>
      <Span end={7}>
        <Flex direction="column">
          <FormGroup
            label="Name"
            direction="column"
            input={({ id }) => (
              <Input
                id={id}
                value={ability.name}
                onValueChange={(name) => ability.set('name', name)}
              />
            )}
          />
          <FormGroup
            label="Value"
            direction="column"
            input={({ id }) => (
              <Input
                type="number"
                id={id}
                step={1}
                value={ability.value}
                onValueChange={(value) => ability.set('value', Number(value))}
              />
            )}
          />
          <Checkbox
            label="Unlimited applications"
            onChange={(event: React.ChangeEvent<HTMLFormElement>) =>
              ability.set('noOfApplications', event.target.checked ? 'unlimited' : 1)
            }
          />
          <FormGroup
            label="Number of applications"
            direction="column"
            input={({ id }) => (
              <Input
                disabled={ability.noOfApplications === 'unlimited'}
                type="number"
                id={id}
                step={1}
                value={ability.noOfApplications}
                onValueChange={(value) => ability.set('noOfApplications', Number(value))}
              />
            )}
          />
        </Flex>
      </Span>
      <Span start={7} end={13}>
        <FormGroup
          label="Description"
          direction="column"
          input={({ id }: { id: string }) => (
            <Textarea
              id={id}
              value={ability.description}
              onValueChange={(value) => ability.set('description', value)}
            />
          )}
        />
      </Span>
    </Grid>
  );
});
