import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';
import Select from 'react-select';

import { Box } from 'ui/Box';
import { Button } from 'ui/Button';
import { Checkbox } from 'ui/Checkbox';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { IncDec } from 'ui/IncDec';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Iweapon, SIweapon, SOweapon, weaponTypeFields, WEAPON_TYPES } from 'store/weapons';
import { Flex, Grid, Span } from 'ui/Grid';
import { RadioGroup } from 'ui/RadioGroup';
import { capitalizeFirstLetter } from 'lib/strings';
import { Textarea } from 'ui/Textarea';
import { DICE_TYPES } from 'store/consts';
import { action } from 'mobx';
import { Iskill } from 'store/characters/skillModel';
import { IbaseSkill } from 'store/skills';

type SkillNamesForWeapons = 'athletics' | 'fighting' | 'shooting';
interface WeaponFormProps {
  title: string;
  weapon: Iweapon;
  saveWeapon: () => void;
  discardWeapon: () => void;
}

export const WeaponForm = observer(function WeaponFormFn({
  weapon,
  title,
  saveWeapon,
  discardWeapon,
  ...otherProps
}: WeaponFormProps) {
  const store = useContext<Istore>(StoreContext);
  interface IavailableSkill extends IbaseSkill {
    name: SkillNamesForWeapons;
  }

  const localStore = useLocalStore(() => ({
    get availableSkills() {
      return (store.skills.asArray.filter((skill) =>
        weapon.isForSkill(skill.name)
      ) as unknown) as IavailableSkill[];
    },
  }));

  const toggleWeaponSpecialization = (
    skillName: SkillNamesForWeapons,
    specializationName: string
  ) => {
    if (weapon.specializations[skillName].array.includes(specializationName)) {
      weapon.specializations[skillName].delete(specializationName);
    } else {
      weapon.specializations[skillName].add(specializationName);
    }
  };

  return (
    <form>
      <Grid>
        <Span as="h1">{title}</Span>
        <Span
          as={FormGroup}
          label="Name"
          input={({ id }: { id: string }) => (
            <Input
              id={id}
              value={weapon.name}
              onValueChange={(value) => weapon.set('name', value)}
            />
          )}
        />
        <Span
          as={FormGroup}
          label="Notes"
          input={({ id }: { id: string }) => (
            <Textarea
              id={id}
              value={weapon.notes}
              onValueChange={(value) => weapon.set('notes', value)}
            />
          )}
        />
        <Span>
          <FormGroup
            label="Weapon type"
            input={({ id }) => (
              <div>
                <Grid spacing="inside">
                  {WEAPON_TYPES.map((weaponType) => [
                    weaponType,
                    capitalizeFirstLetter(weaponType),
                  ]).map(([weaponType, label], index) => (
                    <Span
                      key={weaponType}
                      start={index % 2 === 0 ? 1 : 7}
                      end={index % 2 === 0 ? 7 : 13}
                      row={Math.ceil((1 + 1 * index) / 2)}
                      horizontal="start"
                    >
                      <Checkbox
                        id={id}
                        label={label}
                        checked={weapon.weaponType[weaponType as keyof typeof weaponTypeFields]}
                        onChange={() =>
                          weapon.weaponType.set(
                            weaponType as keyof typeof weaponTypeFields,
                            !weapon.weaponType[weaponType as keyof typeof weaponTypeFields]
                          )
                        }
                      />
                    </Span>
                  ))}
                </Grid>
              </div>
            )}
          />
        </Span>

        {!!localStore.availableSkills.length && <Span as="h3">Weapon specializations</Span>}
        {localStore.availableSkills.map((skill, index) => (
          <Span
            key={skill._id}
            start={1 + (12 / localStore.availableSkills.length) * index}
            end={
              1 +
              12 / localStore.availableSkills.length +
              (12 / localStore.availableSkills.length) * index
            }
          >
            <Flex direction="column" spacing="inside">
              <strong>{capitalizeFirstLetter(skill.displayName)}</strong>
              {skill.availableSkillSpezializations.array?.map((specialization) => {
                return (
                  <Checkbox
                    key={specialization._id}
                    label={specialization.name}
                    checked={weapon.specializations[skill.name].array.includes(specialization.name)}
                    onChange={() => toggleWeaponSpecialization(skill.name, specialization.name)}
                  />
                );
              })}
            </Flex>
          </Span>
        ))}
        <Span as="hr" />
        <Span as="h3">Weapon Damage</Span>

        {DICE_TYPES.map((diceSides) => (
          <Span key={diceSides}>
            <FormGroup
              label={
                <Flex horizontal="space-between">
                  {diceSides === 4 ? <strong>Dices</strong> : <div />} <div>D{diceSides}</div>
                </Flex>
              }
              input={() => (
                <IncDec
                  value={weapon.damage.dices[diceSides]}
                  onIncrement={() =>
                    weapon.damage.dices.set(diceSides, weapon.damage.dices[diceSides] + 1)
                  }
                  onDecrement={() =>
                    weapon.damage.dices.set(diceSides, weapon.damage.dices[diceSides] - 1)
                  }
                  disableDecrement={weapon.damage.dices[diceSides] === 0}
                />
              )}
            />
          </Span>
        ))}

        <Span>
          <FormGroup
            label="Bonus"
            input={() => (
              <IncDec
                value={weapon.damage.bonus}
                onIncrement={() => weapon.damage.set('bonus', weapon.damage.bonus + 1)}
                onDecrement={() => weapon.damage.set('bonus', weapon.damage.bonus - 1)}
              />
            )}
          />
        </Span>
        <Span start={1} end={5} />
        <Span start={5} end={13}>
          <Checkbox
            label="Include strength"
            checked={weapon.damage.strength}
            onChange={() => weapon.damage.set('strength', !weapon.damage.strength)}
          />
        </Span>
        <Span as="hr" />
        {weapon.isRangedWeapon && (
          <>
            <Span as="h3">Range</Span>
            {['Short', 'Medium', 'Long'].map((label, index) => (
              <Span key={label} start={1 + 4 * index} end={5 + 4 * index}>
                <FormGroup
                  direction="column"
                  label={label}
                  input={({ id }) => (
                    <Input
                      id={id}
                      type="number"
                      value={weapon.range.array[index]}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        weapon.range.set(index, Number(event.target.value))
                      }
                    />
                  )}
                />
              </Span>
            ))}
            <Span as="hr" />
          </>
        )}
        {weapon.isShootingWeapon && (
          <>
            <Span start={1} end={7}>
              <FormGroup
                label="Shots"
                direction="column"
                input={({ id }) => (
                  <Input
                    id={id}
                    type="number"
                    value={weapon.shots}
                    onValueChange={(value) => weapon.set('shots', Number(value))}
                  />
                )}
              />
            </Span>
            <Span start={7} end={13}>
              <FormGroup
                label={`Rate of Fire: ${weapon.rateOfFire}`}
                direction="column"
                input={({ id }) => (
                  <Input
                    id={id}
                    type="range"
                    step={1}
                    min={1}
                    max={6}
                    value={weapon.rateOfFire}
                    onValueChange={(value) =>
                      weapon.set('rateOfFire', Number(value) as SOweapon['rateOfFire'])
                    }
                  />
                )}
              />
            </Span>
            <Span as="hr" />
          </>
        )}
        <Span as={Flex} horizontal="end">
          <Button variant="danger" size="big" onClick={() => discardWeapon()}>
            Cancel
          </Button>
          <Button variant="success" size="big" onClick={() => saveWeapon()}>
            Save Weapon
          </Button>
        </Span>
      </Grid>
    </form>
  );
});
