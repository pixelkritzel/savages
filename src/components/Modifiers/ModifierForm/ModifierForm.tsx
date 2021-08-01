import React, { useRef, useContext } from 'react';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import styled, { css } from 'styled-components';
import Select from 'react-select';
import ReactModal from 'react-modal';

import { Box } from 'ui/Box';
import { Button } from 'ui/Button';
import { Checkbox } from 'ui/Checkbox';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { modifierModel } from 'store/modifiers';
import { ItraitModifier, traitModifierModel } from 'store/modifiers/traitModifierModel';

import { TraitModifierForm } from './TraitModifierForm';

const formGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: ${({ theme }) => theme.rhythms.outside.horizontal}px;
  row-gap: ${({ theme }) => theme.rhythms.outside.vertical}px;
`;

const Form = styled.form`
  ${formGrid}
`;

const TwoColumns = styled.div`
  grid-column: 1 / span 2;
`;

const Traits = styled(Box)`
  ${formGrid}
`;

const NewTraitButton = styled(Button)`
  justify-self: end;
`;

interface ModifierFormProps {
  children?: React.ReactNode;
}

export const ModifierForm = observer(function ModifierFormFn({ ...otherProps }: ModifierFormProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore<{
    newTraitModifier?: ItraitModifier;
  }>(() => ({}));
  const { current: modifier } = useRef(modifierModel.create());

  const newTraitModifier = action(
    () => (localStore.newTraitModifier = traitModifierModel.create())
  );

  const saveNewTraitModifier = action(() => {
    modifier.addTraitModifier(localStore.newTraitModifier!);
    localStore.newTraitModifier = undefined;
  });

  return (
    <Form>
      {([
        ['name', 'Name'],
        ['conditions', 'Conditions'],
      ] as const).map(([key, label]) => (
        <FormGroup
          inline
          key={key}
          label={label}
          input={({ id }) => (
            <Input
              id={id}
              value={modifier[key]}
              onValueChange={(value) => modifier.set(key, value)}
            />
          )}
        />
      ))}
      {([
        ['isOptional', 'Optional Modifier'],
        ['isBenefit', 'Benefit'],
      ] as const).map(([key, label]) => (
        <Checkbox
          key={key}
          label={label}
          checked={modifier[key]}
          onChange={() => modifier.set(key, !modifier[key])}
        />
      ))}
      <TwoColumns>
        <Traits title="Traits" asFieldset>
          <TwoColumns>
            <FormGroup
              inline
              label="Applicable Traits"
              input={({ id }) => (
                <Select
                  id={id}
                  isMulti
                  options={store.selectedSetting.availableSkills.map(({ name, _id }) => ({
                    label: name,
                    value: _id,
                  }))}
                  onChange={(values) => {
                    modifier.set(
                      'traitNames',
                      // @ts-expect-error
                      values.map(({ value }) => value)
                    );
                  }}
                />
              )}
            />
          </TwoColumns>
          <h3>Trait modifiers</h3>
          <NewTraitButton type="button" variant="success" onClick={() => newTraitModifier()}>
            New Trait modifier
          </NewTraitButton>
          {localStore.newTraitModifier && (
            <ReactModal
              isOpen={Boolean(localStore.newTraitModifier)}
              shouldCloseOnEsc={true}
              onRequestClose={() => saveNewTraitModifier()}
              ariaHideApp={false}
            >
              <TraitModifierForm
                traitModifier={localStore.newTraitModifier}
                title="New trait modifier"
              />
            </ReactModal>
          )}
          <ul>
            {modifier.traitModifiers.map(({ _id, traitName }) => (
              <li key={_id}>{traitName}</li>
            ))}
          </ul>
        </Traits>
      </TwoColumns>
    </Form>
  );
});
