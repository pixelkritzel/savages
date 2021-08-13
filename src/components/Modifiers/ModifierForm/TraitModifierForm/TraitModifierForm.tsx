import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { kebabCase } from 'lodash';

import { RadioGroup } from 'ui/RadioGroup';
import { FormGroup } from 'ui/FormGroup';
import { IncDec } from 'ui/IncDec';
import { Button } from 'ui/Button';
import { Box } from 'ui/Box';
import { Input } from 'ui/Input';
import { Select } from 'ui/Select';
import { Flex, Grid, Span } from 'ui/Grid';

import { StoreContext } from 'components/StoreContext';

import { capitalizeFirstLetter } from 'lib/strings';

import { Istore } from 'store';
import { ItraitModifier, traitModifierModelTypes } from 'store/modifiers/traitModifierModel';
import { attributeNames } from 'store/consts';
import { IbaseSkill } from 'store/skills';

const NONE_OPTION = {
  label: 'None',
  value: '',
};

interface TraitModifierFormProps {
  title: string;
  traitModifier: ItraitModifier;
  saveTraitModifier: () => void;
  discardTraitModifier: () => void;
}

export const TraitModifierForm = observer(function TraitModifierFormFn({
  title,
  traitModifier,
  saveTraitModifier,
  discardTraitModifier,
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
          ...store.selectedSetting.availableSkills.array.map(({ name, _id }) => ({
            label: name,
            value: _id,
          })),
        ];
      } else {
        return [];
      }
    },
    get selectedTraitOption() {
      return this.traitOptions?.find(({ value }) => value === traitModifier.traitName);
    },
    get settingSkill(): IbaseSkill {
      return (
        (traitModifier.type === 'skill' &&
          store.selectedSetting.availableSkills.array.find(
            ({ _id }) => _id === traitModifier.traitName
          )) ||
        undefined
      );
    },
    get specializationsOptions() {
      return this.settingSkill
        ? [
            NONE_OPTION,
            ...this.settingSkill.availableSkillSpezializations.array.map((spezialization) => ({
              label: capitalizeFirstLetter(spezialization.name),
              value: spezialization._id,
            })),
          ]
        : [];
    },
    get selectedSpecializationOption() {
      return this.specializationsOptions?.find(
        ({ value }) => value === traitModifier.specialization.specializationName
      )?.value;
    },
  }));

  return (
    <>
      <h3>{title}</h3>
      <Grid>
        <Span start={1} end={7} as={Box} title="Type">
          <RadioGroup
            radios={traitModifierModelTypes.map((type) => [type, capitalizeFirstLetter(type)])}
            selectedValue={traitModifier.type}
            setSelectedValue={(value) =>
              traitModifier.setType(value as typeof traitModifierModelTypes[number])
            }
          />
        </Span>
        <Span start={7} end={13} vertical="center">
          {localStore.traitOptions ? (
            <FormGroup
              label="Applicable Traits"
              input={({ id }) =>
                ['pace', 'all'].includes(traitModifier.type) ? (
                  <Input id={id} disabled value={capitalizeFirstLetter(traitModifier.type)} />
                ) : (
                  <Select
                    id={id}
                    value={traitModifier.traitName}
                    options={localStore.traitOptions!}
                    onValueChange={(value) => {
                      traitModifier.set('traitName', value);
                    }}
                  />
                )
              }
            />
          ) : (
            <div />
          )}
        </Span>
        {([
          'bonusValue',
          'bonusDice',
          'diceMinimum',
          'diceMaximum',
          'bonusMinimum',
          'bonusMaximum',
        ] as const).map((key, index) => (
          <Span key={key} start={!(index % 2) ? 1 : 7} end={!(index % 2) ? 7 : 13}>
            <FormGroup
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
          </Span>
        ))}
        {localStore.settingSkill &&
          localStore.settingSkill.availableSkillSpezializations.array.length > 0 && (
            <>
              <FormGroup
                inline
                label="Spezialization"
                input={({ id }) => (
                  <Select
                    id={id}
                    value={localStore.selectedSpecializationOption}
                    options={localStore.specializationsOptions}
                    onValueChange={(value) => {
                      traitModifier.specialization.set('specializationName', value);
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
        <Span as={Flex} horizontal="end" spacing="inside">
          <Button variant="danger" onClick={discardTraitModifier}>
            Cancel
          </Button>
          <Button variant="success" disabled={!traitModifier.isValid} onClick={saveTraitModifier}>
            Save
          </Button>
        </Span>
      </Grid>
    </>
  );
});
