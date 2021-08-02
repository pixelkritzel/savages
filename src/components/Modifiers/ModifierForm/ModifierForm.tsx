import React, { useRef, useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';
import Select from 'react-select';

import { Box } from 'ui/Box';
import { Checkbox } from 'ui/Checkbox';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { IncDec } from 'ui/IncDec';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { createModifierScaffold, modifierModel } from 'store/modifiers';
import { attributeNames, DICE_TYPES } from 'store/consts';

import { capitalizeFirstLetter } from 'lib/strings';

import { AddedHindrances } from './AddedHindrances';
import { GrantedPowers } from './GrantedPowers';
import { GrantedSkills } from './GrantedSkills';
import { Traits } from './Traits';
import { formGrid, TwoColumns } from './styled';

const Form = styled.form`
  ${formGrid}
`;

const BonusDamageDice = styled(Box)`
  ${formGrid}
`;

interface ModifierFormProps {
  children?: React.ReactNode;
}

export const ModifierForm = observer(function ModifierFormFn({ ...otherProps }: ModifierFormProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({
    get traitOptions() {
      const attributes = attributeNames.map((name) => ({
        label: capitalizeFirstLetter(name),
        value: name,
      }));
      const skills = store.selectedSetting.availableSkills.array.map(({ name, _id }) => ({
        label: name,
        value: _id,
      }));
      return [...attributes, ...skills, { label: 'Pace', value: 'pace' }];
    },
    get edgesOptions() {
      return store.selectedSetting.availableEdges.map(({ name, _id }) => ({
        label: name,
        value: _id,
      }));
    },
  }));
  const { current: modifier } = useRef(modifierModel.create(createModifierScaffold()));

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
        <Traits modifier={modifier} traitOptions={localStore.traitOptions} />
      </TwoColumns>
      {([
        ['bennies', 'Bennies'],
        ['aimingHelp', 'Additional aiming ignore bonuss'],
        ['toughness', 'Toughness'],
        ['size', 'Size'],
        ['freeEdges', 'Free Edges'],
        ['bonusDamage', 'Additional Damage'],
        ['rerollBonus', 'Bonus while rerolling'],
        ['rerollDamageBonus', 'Additional Damage while rerolling'],
        ['armor', 'Armor bonus'],
        ['ignoreWounds', 'Ignore Wound penalties'],
        ['ignoreMultiActionPenalty', 'Ignore multi action'],
        ['ignoreRecoil', 'Ignore recoil bonus'],
        ['pace', 'Pace'],
        ['minimumStrength', 'Treat strength as higher'],
        ['reach', 'Reach'],
      ] as const).map(([key, label]) => (
        <FormGroup
          inline
          key={key}
          label={label}
          input={() => (
            <IncDec
              value={modifier[key]}
              onIncrement={() => modifier.set(key, modifier[key] + 1)}
              onDecrement={() => modifier.set(key, modifier[key] - 1)}
            />
          )}
        />
      ))}
      {([
        ['ignoreImprovisedWeapon', ' Ignore improvised weapon malus'],
        ['ignoreMinimumStrength', 'Ignore minimum strength'],
        ['ignoreOffhand', 'Ignore offhand malus'],
        ['big', 'Big'],
        ['hardy', 'Hardy'],
      ] as const).map(([key, label]) => (
        <Checkbox
          key={key}
          label={label}
          checked={modifier[key]}
          onChange={() => modifier.set(key, !modifier[key])}
        />
      ))}
      <TwoColumns>
        <BonusDamageDice title="Bonus Damage Dice" asFieldset>
          {DICE_TYPES.map((diceSides) => (
            <FormGroup
              key={diceSides}
              label={`D${diceSides}`}
              input={() => (
                <IncDec
                  value={modifier.bonusDamageDices[diceSides]}
                  onIncrement={() =>
                    modifier.bonusDamageDices.set(
                      diceSides,
                      modifier.bonusDamageDices[diceSides] + 1
                    )
                  }
                  onDecrement={() =>
                    modifier.bonusDamageDices.set(
                      diceSides,
                      modifier.bonusDamageDices[diceSides] - 1
                    )
                  }
                  disableDecrement={modifier.bonusDamageDices[diceSides] === 0}
                />
              )}
            />
          ))}
        </BonusDamageDice>

        <FormGroup
          label="Free reroll for"
          input={({ id }) => (
            <Select
              id={id}
              options={localStore.traitOptions}
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
        {([
          ['forbiddenEdges', 'Unavailable Edges'],
          ['grantedEdges', 'Grants Edges'],
        ] as const).map(([key, label]) => (
          <FormGroup
            key={key}
            label={label}
            input={({ id }) => (
              <Select
                id={id}
                isMulti
                options={localStore.edgesOptions}
                onChange={(values) => {
                  modifier.set(
                    key,
                    // @ts-expect-error
                    { array: values.map(({ value }) => value) }
                  );
                }}
              />
            )}
          />
        ))}

        <AddedHindrances modifier={modifier} />
        <GrantedPowers modifier={modifier} />
        <GrantedSkills modifier={modifier} />
      </TwoColumns>
    </Form>
  );
});
