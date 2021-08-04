import React from 'react';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';
import Select, { OptionsType, OptionTypeBase } from 'react-select';
import ReactModal from 'react-modal';

import { FormGroup } from 'ui/FormGroup';
import { Button } from 'ui/Button';
import { List } from 'ui/List';

import { Imodifier } from 'store/modifiers';
import { ItraitModifier, traitModifierModel } from 'store/modifiers/traitModifierModel';

import { padWithMathOperator } from 'utils/padWithMathOpertor';
import { capitalizeFirstLetter } from 'lib/strings';

import { TraitModifierForm } from '../TraitModifierForm';
import { formGrid, TwoColumns } from '../styled';

const GridContainer = styled.div`
  ${formGrid}
`;

const NewTraitButton = styled(Button)`
  justify-self: end;
`;

const NoTraitModifiers = styled(TwoColumns)`
  color: ${({ theme }) => theme.colors.disabled};
  text-align: center;
`;

const TraitModifierRow = styled.li`
  grid-column: 1 / span 2;
  display: grid;
  grid-template-columns: 1fr auto auto;
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px;

  &::not(:last-child) {
    padding-bottom: ${({ theme }) => theme.rhythms.inside.vertical}px;
  }
`;

const TraitModifierList = styled(List)`
  & > li:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical}px;
  }
`;

interface TraitsProps {
  modifier: Imodifier;
  traitOptions: OptionsType<OptionTypeBase>;
}

export const Traits = observer(function TraitsFn({
  modifier,
  traitOptions,
  ...otherProps
}: TraitsProps) {
  const localStore = useLocalStore<{
    traitModifier?: ItraitModifier;
  }>(() => ({}));
  const openTraitModifier = action(
    (traitModifier?: ItraitModifier) =>
      (localStore.traitModifier = traitModifier ? traitModifier : traitModifierModel.create())
  );

  const saveTraitModifier = action(() => {
    if (!modifier.traitModifiers.has(localStore.traitModifier)) {
      modifier.traitModifiers.add(localStore.traitModifier!);
    }
    localStore.traitModifier = undefined;
  });
  return (
    <GridContainer>
      <TwoColumns>
        <FormGroup
          inline
          label="Applicable Traits"
          input={({ id }) => (
            <Select
              id={id}
              isMulti
              options={traitOptions}
              onChange={(values) => {
                modifier.set(
                  'traitNames',
                  // @ts-expect-error
                  { array: values.map(({ value }) => value) }
                );
              }}
            />
          )}
        />
      </TwoColumns>
      <h3>Trait modifiers</h3>
      <NewTraitButton type="button" variant="success" onClick={() => openTraitModifier()}>
        New Trait modifier
      </NewTraitButton>
      {localStore.traitModifier && (
        <ReactModal
          isOpen={Boolean(localStore.traitModifier)}
          shouldCloseOnEsc={true}
          onRequestClose={() => saveTraitModifier()}
          ariaHideApp={false}
        >
          <TraitModifierForm
            traitModifier={localStore.traitModifier}
            title="New trait modifier"
            saveTraitModifier={saveTraitModifier}
          />
        </ReactModal>
      )}
      <TwoColumns>
        {Boolean(modifier.traitModifiers.length) ? (
          <TraitModifierList>
            {modifier.traitModifiers.array.map((traitMod) => (
              <TraitModifierRow key={traitMod._id}>
                <div>
                  <strong>{capitalizeFirstLetter(traitMod.traitName)}</strong>:
                  {` Dice: ${padWithMathOperator(
                    traitMod.bonusDice
                  )} | Bonus: ${padWithMathOperator(traitMod.bonusValue)}`}
                </div>
                <Button onClick={() => openTraitModifier(traitMod)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => modifier.traitModifiers.delete(traitMod)}>
                  Delete
                </Button>
              </TraitModifierRow>
            ))}
          </TraitModifierList>
        ) : (
          <NoTraitModifiers>No trait modifiers yet</NoTraitModifiers>
        )}
      </TwoColumns>
    </GridContainer>
  );
});
