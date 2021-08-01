import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled, { css } from 'styled-components';
import Select from 'react-select';

import { ItraitModifier, traitModifierModelTypes } from 'store/modifiers/traitModifierModel';
import { RadioGroup } from 'ui/RadioGroup';
import { capitalizeFirstLetter } from 'lib/strings';
import { FormGroup } from 'ui/FormGroup';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { attributeNames } from 'store/consts';
import { kebabCase } from 'lodash';
import { IncDec } from 'ui/IncDec';

const formGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: ${({ theme }) => theme.rhythms.outside.horizontal}px;
  row-gap: ${({ theme }) => theme.rhythms.outside.vertical}px;
`;

const Form = styled.form`
  ${formGrid}
`;

const NONE_OPTION = {
  label: 'None',
  value: '',
};

interface TraitModifierFormProps {
  title: string;
  traitModifier: ItraitModifier;
}

export const TraitModifierForm = observer(function TraitModifierFormFn({
  title,
  traitModifier,
  ...otherProps
}: TraitModifierFormProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({
    get traitOptions() {
      if (traitModifier.type === 'attribute') {
        return [
          NONE_OPTION,
          ...attributeNames.map((name) => ({ label: capitalizeFirstLetter(name), value: name })),
        ];
      } else if (traitModifier.type === 'skill') {
        return [
          NONE_OPTION,
          ...store.selectedSetting.availableSkills.map(({ name, _id }) => ({
            label: name,
            value: _id,
          })),
        ];
      } else {
        return null;
      }
    },
    get selectedTraitOption() {
      return this.traitOptions?.find(({ value }) => value === traitModifier.traitName);
    },
    get settingSkill() {
      return (
        (traitModifier.type === 'skill' &&
          store.selectedSetting.availableSkills.find(
            ({ _id }) => _id === traitModifier.traitName
          )) ||
        undefined
      );
    },
    get specializationsOptions() {
      return this.settingSkill
        ? [
            NONE_OPTION,
            ...this.settingSkill.availableSkillSpezializations.map((spezialization) => ({
              label: capitalizeFirstLetter(spezialization.name),
              value: spezialization._id,
            })),
          ]
        : [];
    },
    get selectedSpecializationOption() {
      return this.specializationsOptions?.find(
        ({ value }) => value === traitModifier.specialization.specializationName
      );
    },
  }));

  return (
    <>
      <h4>{title}</h4>
      <Form>
        <RadioGroup
          radios={traitModifierModelTypes.map((type) => [type, capitalizeFirstLetter(type)])}
          title="Type"
          selectedValue={traitModifier.type}
          setSelectedValue={(value) => traitModifier.set('type', value)}
        />
        {localStore.traitOptions ? (
          <FormGroup
            inline
            label="Applicable Traits"
            input={({ id }) => (
              <Select
                id={id}
                input={localStore.selectedTraitOption}
                options={localStore.traitOptions!}
                onChange={(option) => {
                  if (option) {
                    traitModifier.set('traitName', option.value);
                  }
                }}
              />
            )}
          />
        ) : (
          <div />
        )}
        {([
          'bonusValue',
          'bonusDice',
          'diceMinimum',
          'diceMaximum',
          'bonusMinimum',
          'bonusMaximum',
        ] as const).map((key) => (
          <FormGroup
            key={key}
            inline
            label={kebabCase(key)
              .split('-')
              .map((word, index) => (index === 0 ? capitalizeFirstLetter(word) : word))
              .join(' ')}
            input={(id) => (
              <IncDec
                value={traitModifier[key]}
                onIncrement={() => traitModifier.set(key, traitModifier[key] + 1)}
                onDecrement={() => traitModifier.set(key, traitModifier[key] - 1)}
              />
            )}
          />
        ))}
        {localStore.settingSkill &&
          localStore.settingSkill.availableSkillSpezializations.length > 0 && (
            <>
              <FormGroup
                inline
                label="Spezialization"
                input={({ id }) => (
                  <Select
                    id={id}
                    value={localStore.selectedSpecializationOption}
                    options={localStore.specializationsOptions}
                    onChange={(option) => {
                      if (option) {
                        traitModifier.specialization.set('specializationName', option.value);
                      }
                    }}
                  />
                )}
              />
              {(['specializationBonus', 'specializationDiceDifference'] as const).map((key) => (
                <FormGroup
                  key={key}
                  inline
                  label={kebabCase(key)
                    .split('-')
                    .map((word, index) => (index === 0 ? capitalizeFirstLetter(word) : word))
                    .join(' ')}
                  input={(id) => (
                    <IncDec
                      disableDecrement={
                        !Boolean(traitModifier.specialization.specializationName.length)
                      }
                      disableIncrement={
                        !Boolean(traitModifier.specialization.specializationName.length)
                      }
                      value={traitModifier.specialization[key]}
                      onIncrement={() =>
                        traitModifier.specialization.set(key, traitModifier.specialization[key] + 1)
                      }
                      onDecrement={() =>
                        traitModifier.specialization.set(key, traitModifier.specialization[key] - 1)
                      }
                    />
                  )}
                />
              ))}
            </>
          )}
      </Form>
    </>
  );
});
