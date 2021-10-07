import React, { useContext } from 'react';

import { observer, useLocalStore } from 'mobx-react';
import { Flex, Grid, Span } from 'ui/Grid';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

import { Ihindrance } from 'store/hindrances';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { RadioGroup } from 'ui/RadioGroup';
import { Textarea } from 'ui/Textarea';
import { EditModifier } from './EditModifier';
import { Button } from 'ui/Button';
import { action } from 'mobx';
import ReactModal from 'react-modal';
import { ModifierForm } from 'components/Modifiers/ModifierForm';
import { Imodifier } from 'store/modifiers';

interface HindranceFormProps {
  title: string;
  hindrance: Ihindrance;
  saveHindrance: () => void;
  discardHindrance: () => void;
}

export const HindranceForm = observer(function HindranceFormFn({
  hindrance,
  title,
  saveHindrance,
  discardHindrance,
  ...otherProps
}: HindranceFormProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore<{
    editModifier?: 'edit' | 'new';
  }>(() => ({}));

  const newModifier = action(() => {
    store.modifiers.new();
    localStore.editModifier = 'new';
  });

  const saveModifier = action(async () => {
    if (localStore.editModifier === 'new') {
      localStore.editModifier = undefined;
      const modifier = await store.modifiers.saveNewModel();
      hindrance.modifiers.add(modifier);
    }
  });

  const discardModifier = action(() => {
    if (localStore.editModifier === 'new') {
      store.modifiers.discardNewModel();
    }
    localStore.editModifier = undefined;
  });

  return (
    <Grid as="form">
      <Span as="h3">{title}</Span>
      <Span
        as={FormGroup}
        start={1}
        end={13}
        label="Name"
        horizontal="center"
        input={({ id }: { id: string }) => (
          <Input
            id={id}
            type="text"
            value={hindrance.name}
            onValueChange={(value: string) => hindrance.set('name', value)}
          />
        )}
      />
      <Span start={1} end={13}>
        <FormGroup
          label="Impact"
          input={({ id }: { id: string }) => (
            <RadioGroup
              radios={[
                ['minor', 'Minor'],
                ['major', 'Major'],
              ]}
              selectedValue={hindrance.impact}
              setSelectedValue={(value) => hindrance.set('impact', value)}
            />
          )}
        />
      </Span>
      <Span start={1} end={13}>
        <FormGroup
          label="Description"
          input={({ id }: { id: string }) => (
            <Textarea
              id={id}
              type="text"
              value={hindrance.description}
              rows={10}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                hindrance.set('description', event.target.value)
              }
            />
          )}
        />
      </Span>
      <Span start={1} end={13}>
        <FormGroup
          label="Summary"
          input={({ id }: { id: string }) => (
            <Textarea
              id={id}
              type="text"
              value={hindrance.summary}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                hindrance.set('summary', event.target.value)
              }
            />
          )}
        />
      </Span>
      <Span as="hr" />
      <Span as="h3">Modifiers</Span>
      <Span>
        <Grid spacing="inside">
          {hindrance.modifiers.length === 0 ? (
            <Span>This hindrance doesn't have any modifiers</Span>
          ) : (
            hindrance.modifiers.array.map((modifier: Imodifier) => (
              <Span as={Flex} key={modifier._id} horizontal="space-between" spacing="inside">
                <div>{modifier.name}</div>
                <div>
                  <Flex spacing="inside">
                    <EditModifier modifier={modifier} />
                    <Button onClick={() => hindrance.modifiers.delete(modifier._id)}>Remove</Button>
                  </Flex>
                </div>
              </Span>
            ))
          )}
        </Grid>
      </Span>
      <Span as={Flex} horizontal="space-between">
        <select
          disabled={!store.modifiers.asArray.length}
          value=""
          onChange={(event) => hindrance.modifiers.add(store.modifiers.get(event?.target.value))}
        >
          <option>Add an existing modifier</option>
          {store.modifiers.asArray
            .filter((modifier) => !hindrance.modifiers.array.includes(modifier))
            .map((modifier) => (
              <option key={modifier._id} value={modifier._id}>
                {modifier.name}
              </option>
            ))}
        </select>

        <Button variant="success" onClick={newModifier}>
          New modifier
        </Button>
        {!!localStore.editModifier && (
          <ReactModal isOpen={Boolean(localStore.editModifier)} ariaHideApp={false}>
            <ModifierForm
              title={'New modifier'}
              modifier={store.modifiers.newModel!}
              saveModifier={saveModifier}
              cancel={discardModifier}
            />
          </ReactModal>
        )}
      </Span>
      <Span as="hr" />
      <Span as={Flex} horizontal="end">
        <Button size="big" onClick={discardHindrance}>
          Cancel
        </Button>
        <Button variant="success" size="big" onClick={saveHindrance}>
          Save Hindrance
        </Button>
      </Span>
    </Grid>
  );
});
