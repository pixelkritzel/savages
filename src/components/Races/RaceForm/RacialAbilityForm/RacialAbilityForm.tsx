import React, { useContext, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { IRacialAbility } from 'store/racialAbilities';
import { Flex, Grid, Span } from 'ui/Grid';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { Checkbox } from 'ui/Checkbox';
import { Textarea } from 'ui/Textarea';
import { SubResourcesList } from 'components/SubResourcesList';
import { Imodifier } from 'store/modifiers';
import { ModifierFormContent } from 'components/Modifiers/ModifierForm/ModfierFormContent';
import { generateId } from 'lib/utils/generateId';
import { ComboBox } from 'ui/ComboBox';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { Button } from 'ui/Button';
import { SlideIn } from 'ui/SlideIn';
import styled from 'styled-components';

const NewModifier = styled.div`
  padding: ${({ theme }) => theme.rhythms.outside.vertical}px
    ${({ theme }) => theme.rhythms.outside.horizontal}px;
  margin: ${({ theme }) => theme.rhythms.outside.vertical}px -${({ theme }) => theme.rhythms.outside.horizontal}px;
  background-color: ${({ theme }) => theme.colors.backgrounds.highlight_dark};
`;

interface RacialAbilityFormProps {
  ability: IRacialAbility;
}

export const RacialAbilityForm = observer(function RacialAbilityFormFn({
  ability,
  ...otherProps
}: RacialAbilityFormProps) {
  const store = useContext<Istore>(StoreContext);
  const isNewModifier = !!store.modifiers.newModel;

  const ids = useRef({
    modifiersSearch: generateId(),
    newModifierArea: generateId(),
  });

  const saveNewModifier = useCallback(async () => {
    if (store.modifiers.newModel) {
      const newRacialAbilityId = store.modifiers.newModel?._id;
      await store.modifiers.saveNewModel();
      ability.modifiers.add(store.modifiers.get(newRacialAbilityId));
    }
  }, [ability.modifiers, store.modifiers]);

  return (
    <Grid {...otherProps}>
      <Span end={7}>
        <Flex direction="column">
          <FormGroup
            label="Name *"
            direction="column"
            input={({ id }) => (
              <Input
                id={id}
                value={ability.name}
                onValueChange={(name) => ability.set('name', name)}
                required
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
                min={1}
                value={ability.noOfApplications}
                onValueChange={(value) => ability.set('noOfApplications', Number(value))}
              />
            )}
          />
        </Flex>
      </Span>
      <Span start={7} end={13}>
        <FormGroup
          label="Description *"
          direction="column"
          input={({ id }: { id: string }) => (
            <Textarea
              id={id}
              value={ability.description}
              onValueChange={(value) => ability.set('description', value)}
              required
            />
          )}
        />
      </Span>
      <Span as="hr" />
      <Span as="h2">Modifiers</Span>
      <Span as={Flex} horizontal="space-between">
        <div>
          <FormGroup
            id={ids.current.modifiersSearch}
            inline
            label="Search"
            input={({ id }) => (
              <ComboBox
                labelId={ids.current.modifiersSearch}
                id={id}
                items={store.modifiers.asArray.map(({ _id, name }) => ({
                  value: _id,
                  display: name,
                }))}
                onValueSelect={(value) => ability.modifiers.add(store.modifiers.get(value))}
                placeholder="modifier"
              />
            )}
          />
        </div>
        <Button
          aria-expanded={isNewModifier}
          aria-controls={ids.current.newModifierArea}
          variant="success"
          onClick={() => {
            store.modifiers.new();
          }}
        >
          New
        </Button>
      </Span>

      <SlideIn
        id={ids.current.newModifierArea}
        isOpen={isNewModifier}
        slide={
          <NewModifier>
            <Grid>
              <Span as="h2">New modifier</Span>
              <Span>
                <ModifierFormContent modifier={store.modifiers.newModel!} />
              </Span>
              <Span as={Flex} horizontal="end">
                <Button
                  variant="danger"
                  onClick={() => {
                    store.modifiers.discardNewModel();
                  }}
                >
                  Discard
                </Button>
                <Button variant="success" onClick={saveNewModifier}>
                  Save
                </Button>
              </Span>
            </Grid>
          </NewModifier>
        }
        slideTitle="New modifier"
      />

      <Span>
        <SubResourcesList<Imodifier>
          resources={ability.modifiers}
          emptyText="No modifiers yet"
          editForm={(modifier) => <ModifierFormContent modifier={modifier} />}
        />
      </Span>
    </Grid>
  );
});
