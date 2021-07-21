import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Iskill, isMelee, isShooting as isShootingFn } from 'store/characters/skillModel';
import { Iweapon } from 'store/settings/settingWeaponModel';
import { Alert } from 'ui/Alert';
import { FormGroup } from 'ui/FormGroup';
import { Checkbox } from 'ui/Checkbox';
import { generateId } from 'utils/generateId';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

interface WeaponOptionsProps {
  attackSkill: Iskill;
  currentlyHoldWeapon: Iweapon;
}

@observer
export class WeaponOptions extends React.Component<WeaponOptionsProps> {
  rateOfFireTicksId = generateId();

  inputRateOfFire = ({ id }: { id: string }) => {
    const { attackSkill } = this.props;

    return (
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
          list={this.rateOfFireTicksId}
        />
        <datalist id={this.rateOfFireTicksId}>
          <option value="0" label="1"></option>
          <option value="1" label="2"></option>
          <option value="2" label="3"></option>
          <option value="3" label="4"></option>
          <option value="4" label="5"></option>
          <option value="5" label="6"></option>
        </datalist>
      </>
    );
  };

  render() {
    const { attackSkill, currentlyHoldWeapon, ...otherProps } = this.props;
    const isShooting = isShootingFn(attackSkill);
    return (
      <fieldset {...otherProps}>
        <legend>Weapon Options</legend>
        <GridContainer>
          {isShooting && (
            <div>
              <FormGroup
                label={`Rate of Fire: ${attackSkill.attackOptions.rateOfFire}`}
                input={this.inputRateOfFire}
                inline
              />
              {attackSkill.attackOptions.rateOfFire > currentlyHoldWeapon.rateOfFire && (
                <Alert>The selected Rate of Fire is higher than the weapons Rate of Fire!</Alert>
              )}
            </div>
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
          {isShooting && attackSkill.attackOptions.rateOfFire !== 1 && (
            <Checkbox
              label="Recoil"
              checked={attackSkill.attackOptions.isRecoil}
              onChange={() =>
                attackSkill.attackOptions.set('isRecoil', !attackSkill.attackOptions.isRecoil)
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

          <Checkbox
            label="Off Hand Attack"
            checked={attackSkill.attackOptions.isOffHand}
            onChange={() =>
              attackSkill.attackOptions.set('isOffHand', !attackSkill.attackOptions.isOffHand)
            }
          />
        </GridContainer>
      </fieldset>
    );
  }
}
