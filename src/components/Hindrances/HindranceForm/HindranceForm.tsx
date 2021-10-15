import React, { useContext } from 'react';
import { action } from 'mobx';
import ReactModal from 'react-modal';
import { observer, useLocalStore } from 'mobx-react';

import { Button } from 'ui/Button';
import { ComboBox } from 'ui/ComboBox';
import { Flex, Grid, Span } from 'ui/Grid';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { RadioGroup } from 'ui/RadioGroup';
import { Textarea } from 'ui/Textarea';

import { ModifierForm } from 'components/Modifiers/ModifierForm';
import { ModifierFormContent } from 'components/Modifiers/ModifierForm/ModfierFormContent';
import { StoreContext } from 'components/StoreContext';
import { SubResourcesList } from 'components/SubResourcesList';

import { Istore } from 'store';
import { Ihindrance } from 'store/hindrances';
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
    <Grid as="form" {...otherProps}>
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
      <Span as={Flex} horizontal="space-between">
        <FormGroup
          inline
          id="hindrance-form-existing-modifiers-search"
          label="Search"
          input={({ id }) => (
            <ComboBox
              id={id}
              labelId="hindrance-form-existing-modifiers-search"
              placeholder="Existing modifiers"
              items={store.modifiers.asArray
                .filter((modifier) => !hindrance.modifiers.has(modifier))
                .map(({ _id, name }) => ({
                  value: _id,
                  display: name,
                }))}
              onValueSelect={(modifierId) => hindrance.modifiers.add(modifierId)}
            />
          )}
        />
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
      <Span>
        <SubResourcesList<Imodifier>
          resources={hindrance.modifiers}
          emptyText="This hindrance doesn't have any modifiers"
          editForm={(modifier) => <ModifierFormContent modifier={modifier} />}
        />
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
