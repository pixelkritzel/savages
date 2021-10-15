import { useContext, useRef, useMemo, useCallback } from 'react';

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
import styled from 'styled-components';
import { SlideIn } from 'ui/SlideIn';
import { RacialAbilityForm } from './RacialAbilityForm';
import { SubResourcesList } from 'components/SubResourcesList';
import { IRacialAbility } from 'store/racialAbilities';

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

  const saveNewRacialAbility = useCallback(async () => {
    if (store.racialAbilities.newModel) {
      const newRacialAbilityId = store.racialAbilities.newModel?._id;
      await store.racialAbilities.saveNewModel();
      race.abilities.add(store.racialAbilities.get(newRacialAbilityId));
    }
  }, [race.abilities, store.racialAbilities]);

  return (
    <Grid as="form">
      <Span as="h1"> Race Form</Span>
      <Span>
        <FormGroup
          label="Name *"
          input={({ id }) => (
            <Input id={id} value={race.name} onValueChange={(value) => race.set('name', value)} />
          )}
        />
      </Span>
      <Span>
        <FormGroup
          label="Description *"
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
          onClick={() => {
            store.racialAbilities.new();
          }}
        >
          New
        </Button>
      </Span>
      <Span>
        <SlideIn id={ids.current.newRacialAbility} isOpen={isNewRacialAbility}>
          <NewRacialAbility>
            {store.racialAbilities.newModel && (
              <Grid>
                <Span as="h2">New racial ability</Span>
                <Span>
                  <RacialAbilityForm ability={store.racialAbilities.newModel} />
                </Span>
                <Span as={Flex} horizontal="end">
                  <Button variant="danger" onClick={() => store.racialAbilities.discardNewModel()}>
                    Discard
                  </Button>
                  <Button
                    disabled={store.racialAbilities.newModel.isInvalid}
                    variant="success"
                    onClick={saveNewRacialAbility}
                  >
                    Save
                  </Button>
                </Span>
              </Grid>
            )}
          </NewRacialAbility>
        </SlideIn>
      </Span>
      <Span>
        <SubResourcesList<IRacialAbility>
          resources={race.abilities}
          emptyText="No racial abilities yet"
          editForm={(racialAbility) => <RacialAbilityForm ability={racialAbility} />}
        />
      </Span>
    </Grid>
  );
});
