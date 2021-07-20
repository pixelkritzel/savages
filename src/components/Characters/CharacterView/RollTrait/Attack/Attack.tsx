import React from 'react';
import { observer } from 'mobx-react';

import { RadioGroup } from 'ui/RadioGroup';
import { Table } from 'ui/Table';

import { Cover } from './Cover';
import { CalledShot } from './CalledShot';
import { WeaponOptions } from './WeaponOptions';
import { TargetOptions } from './TargetOptions';

import { ATTACK_SKILLS, isAttackSkill, Iskill, isShooting } from 'store/characters/skillModel';
import { Icharacter } from 'store/characters';

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
      attackSkill.attack?.set('aim', attackSkill.attack.aim !== 'ignore' ? 'ignore' : null);
    }

    function setPlusTwo() {
      attackSkill.attack?.set('aim', attackSkill.attack.aim !== 'plusTwo' ? 'plusTwo' : null);
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

        <TargetOptions attackSkill={attackSkill} />
        <fieldset>
          <legend>Range</legend>
          <label>
            <input
              type="radio"
              name="range"
              checked={attackSkill.attack.range === '0'}
              onChange={() => attackSkill.attack.set('range', '0')}
            />{' '}
            Short (0)
          </label>
          <label>
            <input
              type="radio"
              name="range"
              checked={attackSkill.attack.range === '-2'}
              onChange={() => attackSkill.attack.set('range', '-2')}
            />{' '}
            Medium (-2)
          </label>
          <label>
            <input
              type="radio"
              name="range"
              checked={attackSkill.attack.range === '-4'}
              onChange={() => attackSkill.attack.set('range', '-4')}
            />{' '}
            Long (-4)
          </label>
          <label>
            <input
              type="radio"
              name="range"
              checked={attackSkill.attack.range === '-8'}
              onChange={() => attackSkill.attack.set('range', '-8')}
            />{' '}
            Extreme (-8)
          </label>
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
          selectedValue={attackSkill.attack.scale}
          setSelectedValue={(value: string) =>
            attackSkill.attack.set('scale', value as Iskill['attack']['scale'])
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
          selectedValue={attackSkill.attack.speed}
          setSelectedValue={(value: string) =>
            attackSkill.attack.set('speed', value as Iskill['attack']['speed'])
          }
        />
        <fieldset>
          <legend>Aim</legend>
          <p>
            <label>
              <input
                type="checkbox"
                checked={attackSkill.attack.aim === 'ignore'}
                onChange={setIgnore}
              />
              Ignore up to -4 penalties
            </label>
          </p>
          <p>
            <label>
              <input
                type="checkbox"
                checked={attackSkill.attack.aim === 'plusTwo'}
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
