import { useContext, useRef, useMemo } from 'react';

import { observer } from 'mobx-react';
import { Flex, Grid, Span } from 'ui/Grid';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

import { IRace } from 'store/races';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { Textarea } from 'ui/Textarea';
import { ComboBox } from 'ui/ComboBox';
import { generateId } from 'lib/utils/generateId';
import { Button } from 'ui/Button';
import { action } from 'mobx';
import styled from 'styled-components';
import { SlightIn } from 'ui/SlightIn';
import { RacialAbilityForm } from './RacialAbilityForm';

const NewRacialAbility = styled.div`
  padding: ${({ theme }) => theme.rhythms.outside.vertical}px
    ${({ theme }) => theme.rhythms.outside.horizontal}px;
  margin: ${({ theme }) => theme.rhythms.outside.vertical}px -${({ theme }) => theme.rhythms.outside.horizontal}px;
  background-color: ${({ theme }) => theme.colors.backgrounds.highlight_light};
`;

interface RaceFormProps {
  title: string;
  race: IRace;
  saveRace: () => void;
  discardRace: () => void;
}

export const RaceForm = observer(function RaceFormFn({
  race,
  title,
  saveRace,
  discardRace,
  ...otherProps
}: RaceFormProps) {
  const store = useContext<Istore>(StoreContext);

  const isNewRacialAbility = useMemo(() => !!store.racialAbilities.newModel, [
    store.racialAbilities.newModel,
  ]);

  const ids = useRef({
    newRacialAbility: generateId(),
    racialAbilitySearchLabel: generateId('label'),
  });

  const newRacialAbility = action(() => {
    store.racialAbilities.new();
  });

  return (
    <Grid as="form">
      <Span as="h1"> Race Form</Span>
      <Span>
        <FormGroup
          label="Name"
          input={({ id }) => (
            <Input id={id} value={race.name} onValueChange={(value) => race.set('name', value)} />
          )}
        />
      </Span>
      <Span>
        <FormGroup
          label="Description"
          input={({ id }) => (
            <Textarea
              id={id}
              value={race.description}
              onValueChange={(value) => race.set('description', value)}
            />
          )}
        />
      </Span>
      <Span as="hr" />
      <Span as="h2">Racial Abilities</Span>

      <Span as={Flex} horizontal="space-between">
        <div>
          <FormGroup
            id={ids.current.racialAbilitySearchLabel}
            inline
            label="Search"
            input={({ id }) => (
              <ComboBox
                labelId={ids.current.racialAbilitySearchLabel}
                id={id}
                items={store.racialAbilities.asArray.map(({ _id, name }) => ({
                  value: _id,
                  display: name,
                }))}
                onValueSelect={(value) => race.abilities.add(store.racialAbilities.get(value))}
              />
            )}
          />
        </div>
        <Button
          aria-expanded={isNewRacialAbility}
          aria-controls={ids.current.newRacialAbility}
          variant="success"
          onClick={newRacialAbility}
        >
          New
        </Button>
      </Span>
      <Span>
        <SlightIn id={ids.current.newRacialAbility} isOpen={isNewRacialAbility}>
          <NewRacialAbility>
            {store.racialAbilities.newModel && (
              <>
                <Grid>
                  <Span as="h2">New racial ability</Span>
                </Grid>
                <RacialAbilityForm ability={store.racialAbilities.newModel} />
              </>
            )}
          </NewRacialAbility>
        </SlightIn>
      </Span>
    </Grid>
  );
});
