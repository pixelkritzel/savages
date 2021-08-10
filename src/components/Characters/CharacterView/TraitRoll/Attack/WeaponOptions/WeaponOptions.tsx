import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Iskill, isMelee, isShooting as isShootingFn } from 'store/characters/skillModel';
import { FormGroup } from 'ui/FormGroup';
import { Checkbox } from 'ui/Checkbox';
import { useContext, useMemo } from 'react';
import { Icharacter } from 'store/characters';
import { Table } from 'ui/Table';
import { RateOfFireAndReload } from './RateOfFireAndReload';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';

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
  grid-area: 4 / 1 / 4 / 4;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: ${({ theme }) => theme.rhythms.outside.vertical}px;
  column-gap: ${({ theme }) => theme.rhythms.outside.horizontal}px;

  & > h4 {
    grid-area: 1 / 1 / 1 / 4;
  }
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
  const store = useContext<Istore>(StoreContext);
  const isShooting = useMemo(() => isShootingFn(attackSkill), [attackSkill]);
  const weapons = useMemo(() => character.getWeaponsByAttackSkill(attackSkill), [
    character,
    attackSkill,
  ]);

  const rangeModifiers = character
    .getModifiersByField('rangeModifier')
    .map(({ rangeModifier }) => rangeModifier)
    .filter(({ skill }) => skill === attackSkill._id)
    .reduce(
      (accumulatedModifiers, { asArray }) =>
        asArray!.map((value, index) => value + accumulatedModifiers[index]),
      [0, 0, 0]
    );

  const { currentlyHoldWeapon } = character;

  return (
    <fieldset {...otherProps}>
      <legend>Weapon Options</legend>
      <GridContainer>
        <WeaponSelect
          label="Weapon"
          input={({ id }: { id: string }) => (
            <select
              id={id}
              name="currentWeapon"
              value={currentlyHoldWeapon._id}
              onChange={(event) => character.set('currentlyHoldWeapon', event.target.value as any)}
            >
              {!weapons.includes(currentlyHoldWeapon) && (
                <option key="no_current_weapon">Please select a weapon</option>
              )}
              {weapons.map((weapon) => (
                <option key={weapon._id} value={weapon._id}>
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
                  <td>{`${currentlyHoldWeapon.range.array[0] + rangeModifiers[0]} / ${
                    currentlyHoldWeapon.range.array[1] + rangeModifiers[1]
                  } / ${currentlyHoldWeapon.range.array[2] + rangeModifiers[2]}`}</td>
                  <td>{currentlyHoldWeapon.damage.humanFriendly}</td>
                  <td>{currentlyHoldWeapon.armorPiercing}</td>
                  <td>{currentlyHoldWeapon.rateOfFire}</td>
                  <td>{`${currentlyHoldWeapon.remainingAmmunition} / ${currentlyHoldWeapon.shots}`}</td>
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
        {currentlyHoldWeapon.isForSkill(attackSkill.name) && (
          <>
            {isShooting && (
              <RateOfFireAndReload attackSkill={attackSkill} weapon={currentlyHoldWeapon} />
            )}
            <WeaponModifiers>
              <h4>Weapon Modifiers</h4>
              {currentlyHoldWeapon.modifiers.length > 0 && (
                <>
                  {currentlyHoldWeapon.modifiers.array.map((modifier, index) => (
                    <Checkbox
                      key={index}
                      label={modifier.name}
                      checked={character.activeModifiers.includes(modifier)}
                      onChange={() => modifier.set('isActive', !modifier.isActive)}
                    />
                  ))}
                </>
              )}

              {isShooting && attackSkill.skillOptions.rateOfFire !== 1 && (
                <Checkbox
                  label={`Recoil (${attackSkill.getModifiersAccumulator().boni.recoil})`}
                  checked={attackSkill.skillOptions.isRecoil}
                  onChange={() =>
                    attackSkill.skillOptions.set('isRecoil', !attackSkill.skillOptions.isRecoil)
                  }
                />
              )}

              {isShooting && currentlyHoldWeapon.weaponType.shotgun && (
                <Checkbox
                  label="Use slugs"
                  checked={attackSkill.skillOptions.isShotgunSlugs}
                  onChange={() =>
                    attackSkill.skillOptions.set(
                      'isShotgunSlugs',
                      !attackSkill.skillOptions.isShotgunSlugs
                    )
                  }
                />
              )}
              {isShooting && currentlyHoldWeapon.isThreeRoundBurstSelectable && (
                <Checkbox
                  label="Three Round Burst"
                  checked={attackSkill.skillOptions.isThreeRoundBurst}
                  onChange={() =>
                    attackSkill.skillOptions.set(
                      'isThreeRoundBurst',
                      !attackSkill.skillOptions.isThreeRoundBurst
                    )
                  }
                />
              )}
              {isMelee(attackSkill) && (
                <Checkbox
                  label="Non lethal damage with edged weapon"
                  checked={attackSkill.skillOptions.isNonLethal}
                  onChange={() =>
                    attackSkill.skillOptions.set(
                      'isNonLethal',
                      !attackSkill.skillOptions.isNonLethal
                    )
                  }
                />
              )}
              {currentlyHoldWeapon.isTwoHanded && (
                <Checkbox
                  label="One handed use of two hand weapon"
                  checked={attackSkill.skillOptions.isOneHandedAttack}
                  onChange={() =>
                    attackSkill.skillOptions.set(
                      'isOneHandedAttack',
                      !attackSkill.skillOptions.isOneHandedAttack
                    )
                  }
                />
              )}
              {isShooting && (
                <Checkbox
                  label="Suppressive Fire"
                  checked={attackSkill.skillOptions.isSupressiveFire}
                  onChange={() =>
                    attackSkill.skillOptions.set(
                      'isSupressiveFire',
                      !attackSkill.skillOptions.isSupressiveFire
                    )
                  }
                />
              )}
            </WeaponModifiers>
          </>
        )}
      </GridContainer>
    </fieldset>
  );
});
