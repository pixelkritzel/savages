import React from 'react';
import { observer } from 'mobx-react';

import { RadioGroup } from 'ui/RadioGroup';
import { Table } from 'ui/Table';

import { Cover } from './Cover';
import { CalledShot } from './CalledShot';
import { WeaponOptions } from './WeaponOptions';

import { ATTACK_SKILLS, isAttackSkill, Iskill, isShooting } from 'store/characters/skillModel';
import { Icharacter } from 'store/characters';
import { Checkbox } from 'ui/Checkbox';

interface ShootingProps {
  attackSkill: Iskill;
  character: Icharacter;
}

export const Attack: React.FC<ShootingProps> = observer(
  ({ attackSkill, character, ...otherProps }) => {
    if (!isAttackSkill(attackSkill)) {
      throw new Error(
        `Tried to initialise Shooting component without coressponding attack field in the skill ${attackSkill.name}`
      );
    }

    function setIgnore() {
      attackSkill.attackOptions?.set(
        'aim',
        attackSkill.attackOptions.aim !== 'ignore' ? 'ignore' : null
      );
    }

    function setPlusTwo() {
      attackSkill.attackOptions?.set(
        'aim',
        attackSkill.attackOptions.aim !== 'plusTwo' ? 'plusTwo' : null
      );
    }

    const { currentlyHoldWeapon } = character;

    const weapons = character.getWeaponsByAttackSkill(
      attackSkill.name as typeof ATTACK_SKILLS[number]
    );

    return (
      <>
        <h3>Attack options</h3>
        <label>
          Weapon{' '}
          <select
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
        </label>
        {isShooting(attackSkill) && currentlyHoldWeapon.isRangedWeapon && (
          <>
            <Table>
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
            </Table>
          </>
        )}
        <WeaponOptions attackSkill={attackSkill} currentlyHoldWeapon={currentlyHoldWeapon} />
        <fieldset>
          <legend>Range</legend>
          {[
            ['0', 'Short'],
            ['-2', 'Medium'],
            ['-4', 'Long'],
            ['-8', 'Extreme'],
          ].map(([rangeModifier, label], index) => (
            <Checkbox
              key={index}
              label={`${label} (${
                rangeModifier !== '-8'
                  ? currentlyHoldWeapon.range[index]
                  : currentlyHoldWeapon.range[2] * 4
              })`}
              disabled={
                rangeModifier === '-8' &&
                (currentlyHoldWeapon.weaponType.includes('shotgun') ||
                  !attackSkill.attackOptions.aim)
              }
              checked={attackSkill.attackOptions.range === rangeModifier}
              onChange={() =>
                attackSkill.attackOptions.set(
                  'range',
                  rangeModifier as Iskill['attackOptions']['range']
                )
              }
            />
          ))}
        </fieldset>
        <CalledShot shooting={attackSkill} />
        <Cover shooting={attackSkill} />
        <RadioGroup
          title="Scale"
          radios={[
            ['-6', 'Tiny (-6)'],
            ['-4', 'Very Small (-4)'],
            ['-2', 'Small (-2)'],
            ['0', 'Normal (0)'],
            ['+2', 'Large (+2)'],
            ['+4', 'Huge (+4)'],
            ['+6', 'Gargantuan (+6)'],
          ]}
          selectedValue={attackSkill.attackOptions.scale}
          setSelectedValue={(value: string) =>
            attackSkill.attackOptions.set('scale', value as Iskill['attackOptions']['scale'])
          }
        />
        <RadioGroup
          title="Speed"
          radios={[
            ['0', '< 60 MPH (0)'],
            ['-1', '> 60MPH (-1)'],
            ['-2', '> 120 MPH (-2)'],
            ['-4', '> 240 MPH (-4)'],
            ['-6', '> Mach 1 (-6)'],
            ['-8', '> Mach 2 (8)'],
            ['-10', 'Near Light Speed (-10)'],
          ]}
          selectedValue={attackSkill.attackOptions.speed}
          setSelectedValue={(value: string) =>
            attackSkill.attackOptions.set('speed', value as Iskill['attackOptions']['speed'])
          }
        />
        <fieldset>
          <legend>Aim</legend>
          <p>
            <label>
              <input
                type="checkbox"
                checked={attackSkill.attackOptions.aim === 'ignore'}
                onChange={setIgnore}
              />
              Ignore up to -4 penalties
            </label>
          </p>
          <p>
            <label>
              <input
                type="checkbox"
                checked={attackSkill.attackOptions.aim === 'plusTwo'}
                onChange={setPlusTwo}
              />
              Add +2 bonus
            </label>
          </p>
        </fieldset>
      </>
    );
  }
);
