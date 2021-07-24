import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { RadioGroup } from 'ui/RadioGroup';

import { isAttackSkill, Iskill, isRangedAttack, isShooting } from 'store/characters/skillModel';
import { Icharacter } from 'store/characters';

import { Cover } from './Cover';
import { CalledShot } from './CalledShot';
import { WeaponOptions } from './WeaponOptions';
import { AimingOptions } from './AimingOptions';
import { Range } from './Range';

const Headline = styled.h3`
  margin: 18px 17px 6px;
`;

interface ShootingProps {
  attackSkill: Iskill;
  character: Icharacter;
}

export const Attack: React.FC<ShootingProps> = observer(
  ({ attackSkill, character, ...otherProps }) => {
    if (!isAttackSkill(attackSkill)) {
      throw new Error(
        `Tried to initialise Attack component without coressponding attack field in the skill ${attackSkill.name}`
      );
    }

    const { currentlyHoldWeapon } = character;

    return (
      <>
        <Headline>Attack options</Headline>

        <WeaponOptions attackSkill={attackSkill} character={character} />
        {isRangedAttack(attackSkill) && (
          <Range attackSkill={attackSkill} currentlyHoldWeapon={currentlyHoldWeapon} />
        )}

        <CalledShot attackSkill={attackSkill} />
        <Cover attackSkill={attackSkill} />
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
          selectedValue={attackSkill.skillOptions.scale}
          setSelectedValue={(value: string) =>
            attackSkill.skillOptions.set('scale', value as Iskill['skillOptions']['scale'])
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
          selectedValue={attackSkill.skillOptions.speed}
          setSelectedValue={(value: string) =>
            attackSkill.skillOptions.set('speed', value as Iskill['skillOptions']['speed'])
          }
        />
        {isShooting(attackSkill) && <AimingOptions attackSkill={attackSkill}></AimingOptions>}
      </>
    );
  }
);
