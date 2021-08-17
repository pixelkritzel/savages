import { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';
import Select from 'react-select';

import { Checkbox } from 'ui/Checkbox';
import { FormGroup } from 'ui/FormGroup';
import { Flex, Grid, Span } from 'ui/Grid';
import { Input } from 'ui/Input';
import { IncDec } from 'ui/IncDec';
import { Button } from 'ui/Button';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Imodifier } from 'store/modifiers';
import { attributeNames, DICE_TYPES } from 'store/consts';

import { capitalizeFirstLetter } from 'lib/strings';

import { AddedHindrances } from './AddedHindrances';
import { GrantedPowers } from './GrantedPowers';
import { GrantedSkills } from './GrantedSkills';
import { Traits } from './Traits';
import { Range } from './Range';

interface ModifierFormProps {
  title: string;
  modifier: Imodifier;
  saveModifier: () => void;
  cancel: () => void;
}

const Centered = styled.div`
  text-align: center;
`;

export const ModifierForm = observer(function ModifierFormFn({
  modifier,
  title,
  saveModifier,
  cancel,
  ...otherProps
}: ModifierFormProps) {
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
      return [
        { label: 'All', value: 'all' },
        ...attributes,
        ...skills,
        { label: 'Pace', value: 'pace' },
      ];
    },
    get edgesOptions() {
      return store.selectedSetting.availableEdges.array.map(({ name, _id }) => ({
        label: name,
        value: _id,
      }));
    },
  }));

  return (
    <Grid as="form">
      <Span as="h1">{title}</Span>

      {([
        ['name', 'Name *'],
        ['conditions', 'Conditions'],
      ] as const).map(([key, label], index) => (
        <Span key={key} start={!(index % 2) ? 1 : 7} end={!(index % 2) ? 7 : 13}>
          <FormGroup
            direction="column"
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
        </Span>
      ))}
      {([
        ['isOptional', 'Optional Modifier'],
        ['isBenefit', 'Benefit'],
      ] as const).map(([key, label], index) => (
        <Span key={key} start={!(index % 2) ? 1 : 7} end={!(index % 2) ? 7 : 13}>
          <Checkbox
            key={key}
            label={label}
            checked={modifier[key]}
            onChange={() => modifier.set(key, !modifier[key])}
          />
        </Span>
      ))}
      <Span as="hr" />
      <Span>
        <Traits modifier={modifier} traitOptions={localStore.traitOptions} />
      </Span>
      {([
        { key: 'bennies', label: 'Bennies', componentType: 'INC_DEC' },
        { key: 'aimingHelp', label: 'Additional aiming ignore bonuss', componentType: 'INC_DEC' },
        { key: 'toughness', label: 'Toughness', componentType: 'INC_DEC' },
        { key: 'size', label: 'Size', componentType: 'INC_DEC' },
        { key: 'freeEdges', label: 'Free Edges', componentType: 'INC_DEC' },
        { key: 'bonusDamage', label: 'Additional Damage', componentType: 'INC_DEC' },
        { key: 'rerollBonus', label: 'Bonus while rerolling', componentType: 'INC_DEC' },
        {
          key: 'rerollDamageBonus',
          label: 'Additional Damage while rerolling',
          componentType: 'INC_DEC',
        },
        { key: 'armor', label: 'Armor bonus', componentType: 'INC_DEC' },
        { key: 'ignoreWounds', label: 'Ignore Wound penalties', componentType: 'INC_DEC' },
        { key: 'ignoreMultiActionPenalty', label: 'Ignore multi action', componentType: 'INC_DEC' },
        { key: 'ignoreRecoil', label: 'Ignore recoil bonus', componentType: 'INC_DEC' },
        { key: 'pace', label: 'Pace', componentType: 'INC_DEC' },
        { key: 'minimumStrength', label: 'Treat strength as higher', componentType: 'INC_DEC' },
        { key: 'reach', label: 'Reach', componentType: 'INC_DEC' },
        {
          key: 'ignoreImprovisedWeapon',
          label: ' Ignore improvised weapon malus',
          componentType: 'CHECKBOX',
        },
        {
          key: 'ignoreMinimumStrength',
          label: 'Ignore minimum strength',
          componentType: 'CHECKBOX',
        },
        { key: 'ignoreOffhand', label: 'Ignore offhand malus', componentType: 'CHECKBOX' },
        { key: 'big', label: 'Big', componentType: 'CHECKBOX' },
        { key: 'hardy', label: 'Hardy', componentType: 'CHECKBOX' },
      ] as const).map(({ key, label, componentType }, index) => (
        <Span key={key} start={!(index % 2) ? 1 : 7} end={!(index % 2) ? 7 : 13}>
          {componentType === 'INC_DEC' && typeof modifier[key] === 'number' ? (
            <FormGroup
              key={key}
              label={label}
              input={() => (
                <IncDec
                  value={modifier[key]}
                  onIncrement={() =>
                    modifier.set(
                      key,
                      // @ts-expect-error
                      modifier[key] + 1
                    )
                  }
                  onDecrement={() =>
                    modifier.set(
                      key,
                      // @ts-expect-error
                      modifier[key] - 1
                    )
                  }
                />
              )}
            />
          ) : (
            <Checkbox
              key={key}
              label={label}
              checked={modifier[key]}
              onChange={() => modifier.set(key, !modifier[key])}
            />
          )}
        </Span>
      ))}
      <Span as="hr" />
      <Span as="h4">
        <Centered>Bonus Damage Dice</Centered>
      </Span>
      {DICE_TYPES.map((diceSides, index) => (
        <Span key={diceSides} start={!(index % 2) ? 1 : 7} end={!(index % 2) ? 7 : 13}>
          <FormGroup
            label={`D${diceSides}`}
            input={() => (
              <IncDec
                value={modifier.bonusDamageDices[diceSides]}
                onIncrement={() =>
                  modifier.bonusDamageDices.set(diceSides, modifier.bonusDamageDices[diceSides] + 1)
                }
                onDecrement={() =>
                  modifier.bonusDamageDices.set(diceSides, modifier.bonusDamageDices[diceSides] - 1)
                }
                disableDecrement={modifier.bonusDamageDices[diceSides] === 0}
              />
            )}
          />
        </Span>
      ))}
      <Span as="hr" />
      <Span>
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
      </Span>
      {([
        ['forbiddenEdges', 'Unavailable Edges'],
        ['grantedEdges', 'Grants Edges'],
      ] as const).map(([key, label]) => (
        <Span key={key}>
          <FormGroup
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
        </Span>
      ))}

      <Span>
        <AddedHindrances modifier={modifier} />
      </Span>
      <Span>
        <GrantedPowers modifier={modifier} />
      </Span>
      <Span>
        <GrantedSkills modifier={modifier} />
      </Span>
      <Span as="hr" />
      <Span>
        <Range rangeModifier={modifier.rangeModifier} />
      </Span>
      <Span as={Flex} horizontal="end">
        <Button variant="danger" size="big" onClick={() => cancel()}>
          Cancel
        </Button>
        <Button
          disabled={!modifier.isValid}
          variant="success"
          size="big"
          onClick={() => saveModifier()}
        >
          Save Modifier
        </Button>
      </Span>
    </Grid>
  );
});
