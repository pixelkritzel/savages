import React, { useContext } from 'react';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import ReactModal from 'react-modal';

import { Button } from 'ui/Button';
import { Checkbox } from 'ui/Checkbox';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { IncDec } from 'ui/IncDec';
import { Flex, Grid, Span } from 'ui/Grid';
import { Textarea } from 'ui/Textarea';

import { StoreContext } from 'components/StoreContext';
import { ModifierForm } from 'components/Modifiers/ModifierForm';

import { Istore } from 'store';
import { Iweapon, SOweapon, weaponTypeFields, WEAPON_TYPES } from 'store/weapons';
import { capitalizeFirstLetter } from 'lib/strings';
import { DICE_TYPES } from 'store/consts';
import { IbaseSkill } from 'store/skills';
import { Imodifier } from 'store/modifiers';

import { EditModifier } from './EditModifier';

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

  const localStore = useLocalStore<{
    availableSkills: IavailableSkill[];
    editModifier?: 'edit' | 'new';
  }>(() => ({
    get availableSkills() {
      return (store.skills.asArray.filter((skill) =>
        weapon.isForSkill(skill.name)
      ) as unknown) as IavailableSkill[];
    },
  }));

  const newModifier = action(() => {
    store.modifiers.new();
    localStore.editModifier = 'new';
  });

  const saveModifier = action(async () => {
    if (localStore.editModifier === 'new') {
      localStore.editModifier = undefined;
      const modifier = await store.modifiers.saveNewModel();
      weapon.modifiers.add(modifier);
    }
  });

  const discardModifier = action(() => {
    if (localStore.editModifier === 'new') {
      store.modifiers.discardNewModel();
    }
    localStore.editModifier = undefined;
  });

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
        <Span as={Flex}>
          <div style={{ border: '2px dashed orange' }}>modifiers</div>
        </Span>
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
        <Span
          as={FormGroup}
          label="Armor piercing"
          input={() => (
            <IncDec
              value={weapon.armorPiercing}
              onIncrement={() => weapon.set('armorPiercing', weapon.armorPiercing + 1)}
              onDecrement={() => weapon.set('armorPiercing', weapon.armorPiercing - 1)}
              disableDecrement={weapon.armorPiercing < 1}
            />
          )}
        />
        <Span as={Flex}>
          <FormGroup
            direction="column"
            label="Minimum Strength"
            input={() => (
              <select
                value={weapon.minimumStrength}
                onChange={(event) =>
                  weapon.set(
                    'minimumStrength',
                    Number(event.target.value) as typeof DICE_TYPES[number]
                  )
                }
              >
                {DICE_TYPES.map((dice) => (
                  <option key={dice} value={dice}>
                    D{dice}
                  </option>
                ))}
              </select>
            )}
          />
          <FormGroup
            direction="column"
            label="Weight"
            input={({ id }) => (
              <Input
                id={id}
                type="number"
                value={weapon.weight}
                onValueChange={(value) =>
                  weapon.set('weight', Number(value) > 0 ? Number(value) : weapon.weight)
                }
              />
            )}
          />
          <FormGroup
            direction="column"
            label="Costs"
            input={({ id }) => (
              <Input
                id={id}
                type="number"
                value={weapon.cost}
                onValueChange={(value) =>
                  weapon.set('cost', Number(value) > 0 ? Number(value) : weapon.cost)
                }
              />
            )}
          />
        </Span>
        <Span as={Flex}>
          {([
            ['isImprovisedWeapon', 'Improvised Weapon'],
            ['isTwoHanded', 'Two hand weapon'],
          ] as const).map(([key, label]) => (
            <Checkbox
              key={key}
              label={label}
              value={weapon[key]}
              onChange={() => weapon.set(key, !weapon[key])}
            />
          ))}
        </Span>
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
            <Span start={1} end={5}>
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
            <Span start={5} end={9}>
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
            <Span start={9} end={13} vertical="center">
              <Checkbox
                label="Three round burst"
                value={weapon.isThreeRoundBurstSelectable}
                onChange={() =>
                  weapon.set('isThreeRoundBurstSelectable', !weapon.isThreeRoundBurstSelectable)
                }
              />
            </Span>
            <Span as="hr" />
          </>
        )}
        <Span as="h3">Modifiers</Span>
        <Span>
          <Grid spacing="inside">
            {weapon.modifiers.length === 0 ? (
              <Span>This weapon doesn't have any modifiers</Span>
            ) : (
              weapon.modifiers.array.map((modifier: Imodifier) => (
                <Span as={Flex} key={modifier._id} horizontal="space-between" spacing="inside">
                  <div>{modifier.name}</div>
                  <div>
                    <Flex spacing="inside">
                      <EditModifier modifier={modifier} />
                      <Button onClick={() => weapon.modifiers.delete(modifier._id)}>Remove</Button>
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
            onChange={(event) => weapon.modifiers.add(store.modifiers.get(event?.target.value))}
          >
            <option>Add an existing modifier</option>
            {store.modifiers.asArray
              .filter((modifier) => !weapon.modifiers.array.includes(modifier))
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
