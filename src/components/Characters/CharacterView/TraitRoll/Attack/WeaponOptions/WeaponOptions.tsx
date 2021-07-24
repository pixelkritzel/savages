import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Iskill, isMelee, isShooting as isShootingFn } from 'store/characters/skillModel';
import { Alert } from 'ui/Alert';
import { FormGroup } from 'ui/FormGroup';
import { Checkbox } from 'ui/Checkbox';
import { generateId } from 'utils/generateId';
import { useRef } from 'react';
import { useMemo } from 'react';
import { Icharacter } from 'store/characters';
import { Table } from 'ui/Table';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-gap: 18px;
`;

const WeaponSelect = styled(FormGroup)`
  grid-area: 1 / 1 / 1 / 4;
`;

const WeaponTable = styled(Table)`
  grid-area: 2 / 1 / 2 / 4;
`;

const WeaponModifiers = styled.div`
  grid-area: 3 / 1 / 3 / 4;
`;

interface WeaponOptionsProps {
  character: Icharacter;
  attackSkill: Iskill;
}

export const WeaponOptions = observer(function WeaponOptionsFn({
  attackSkill,
  character,

  ...otherProps
}: WeaponOptionsProps) {
  const { current: rateOfFireTicksId } = useRef(generateId());
  const isShooting = useMemo(() => isShootingFn(attackSkill), [attackSkill]);
  const weapons = useMemo(
    () => character.getWeaponsByAttackSkill(attackSkill),
    [character, attackSkill]
  );

  const { currentlyHoldWeapon } = character;

  return (
    <fieldset {...otherProps}>
      <legend>Weapon Options</legend>
      <GridContainer>
        <WeaponSelect
          label="Weapon"
          input={({ id }) => (
            <select
              id={id}
              name="currentWeapon"
              value={currentlyHoldWeapon.id}
              onChange={(event) => character.set('currentlyHoldWeapon', event.target.value as any)}
            >
              {!weapons.includes(currentlyHoldWeapon) && (
                <option key="no_current_weapon">Please select a weapon</option>
              )}
              {weapons.map((weapon) => (
                <option key={weapon.id} value={weapon.id}>
                  {weapon.name}
                </option>
              ))}
            </select>
          )}
        />
        {isShooting && currentlyHoldWeapon.isRangedWeapon && (
          <>
            <WeaponTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Range</th>
                  <th>Damage</th>
                  <th>AP</th>
                  <th>RoF</th>
                  <th>Shots</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{currentlyHoldWeapon.name}</td>
                  <td>{`${currentlyHoldWeapon.range[0]} / ${currentlyHoldWeapon.range[1]} / ${currentlyHoldWeapon.range[2]}`}</td>
                  <td>{currentlyHoldWeapon.damage.humanFriendly}</td>
                  <td>{currentlyHoldWeapon.armorPiercing}</td>
                  <td>{currentlyHoldWeapon.rateOfFire}</td>
                  <td>{currentlyHoldWeapon.shots}</td>
                </tr>
              </tbody>
            </WeaponTable>
          </>
        )}
        {isMelee(attackSkill) && currentlyHoldWeapon.isMeleeWeapon && (
          <>
            <WeaponTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Damage</th>
                  <th>AP</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{currentlyHoldWeapon.name}</td>
                  <td>
                    {currentlyHoldWeapon.damage.humanFriendly.replace(
                      'STR',
                      `STR (${character.attributes.strength.value})`
                    )}
                  </td>
                  <td>{currentlyHoldWeapon.armorPiercing}</td>
                  <td>{currentlyHoldWeapon.notes}</td>
                </tr>
              </tbody>
            </WeaponTable>
          </>
        )}
        {currentlyHoldWeapon.isForSkill(attackSkill) && currentlyHoldWeapon.modifiers.length > 0 && (
          <WeaponModifiers>
            <h4>Weapon Modifiers</h4>
            {currentlyHoldWeapon.modifiers.map((modifier, index) => (
              <Checkbox
                key={index}
                label={modifier.name}
                checked={attackSkill.activeModifiers.has(modifier.id)}
                onChange={() => attackSkill.toggleActiveModifier(modifier)}
              />
            ))}
          </WeaponModifiers>
        )}
        {isShooting && (
          <div>
            <FormGroup
              label={`Rate of Fire: ${attackSkill.attackOptions.rateOfFire}`}
              input={({ id }) => (
                <>
                  <input
                    type="range"
                    min={1}
                    id={id}
                    max={6}
                    step={1}
                    value={attackSkill.attackOptions.rateOfFire}
                    onChange={(event) =>
                      attackSkill.attackOptions.set('rateOfFire', Number(event.target.value))
                    }
                    list={rateOfFireTicksId}
                  />
                  <datalist id={rateOfFireTicksId}>
                    <option value="0" label="1"></option>
                    <option value="1" label="2"></option>
                    <option value="2" label="3"></option>
                    <option value="3" label="4"></option>
                    <option value="4" label="5"></option>
                    <option value="5" label="6"></option>
                  </datalist>
                </>
              )}
              inline
            />
            {attackSkill.attackOptions.rateOfFire > currentlyHoldWeapon.rateOfFire && (
              <Alert>The selected Rate of Fire is higher than the weapons Rate of Fire!</Alert>
            )}
          </div>
        )}
        {isShooting && attackSkill.attackOptions.rateOfFire !== 1 && (
          <Checkbox
            label={`Recoil (${attackSkill.skillModifierAccumulator.boni.recoil})`}
            checked={attackSkill.attackOptions.isRecoil}
            onChange={() =>
              attackSkill.attackOptions.set('isRecoil', !attackSkill.attackOptions.isRecoil)
            }
          />
        )}
        {isShooting && currentlyHoldWeapon.weaponType.includes('shotgun') && (
          <Checkbox
            label="Use slugs"
            checked={attackSkill.attackOptions.isShotgunSlugs}
            onChange={() =>
              attackSkill.attackOptions.set(
                'isShotgunSlugs',
                !attackSkill.attackOptions.isShotgunSlugs
              )
            }
          />
        )}

        {isMelee(attackSkill) && (
          <Checkbox
            label="Non lethal damage with edged weapon"
            checked={attackSkill.attackOptions.isNonLethal}
            onChange={() =>
              attackSkill.attackOptions.set('isNonLethal', !attackSkill.attackOptions.isNonLethal)
            }
          />
        )}
      </GridContainer>
    </fieldset>
  );
});
