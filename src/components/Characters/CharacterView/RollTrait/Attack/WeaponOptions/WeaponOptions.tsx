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
          value={attackSkill.attack.rateOfFire}
          onChange={(event) => attackSkill.attack.set('rateOfFire', Number(event.target.value))}
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
                label={`Rate of Fire: ${attackSkill.attack.rateOfFire}`}
                input={this.inputRateOfFire}
                inline
              />
              {attackSkill.attack.rateOfFire > currentlyHoldWeapon.rateOfFire && (
                <Alert>The selected Rate of Fire is higher than the weapons Rate of Fire!</Alert>
              )}
            </div>
          )}
          {isShooting && currentlyHoldWeapon.weaponType.includes('shotgun') && (
            <Checkbox
              label="Use slugs"
              checked={attackSkill.attack.isShotgunSlugs}
              onChange={() =>
                attackSkill.attack.set('isShotgunSlugs', !attackSkill.attack.isShotgunSlugs)
              }
            />
          )}
          {isShooting && attackSkill.attack.rateOfFire !== 1 && (
            <Checkbox
              label="Recoil"
              checked={attackSkill.attack.isRecoil}
              onChange={() => attackSkill.attack.set('isRecoil', !attackSkill.attack.isRecoil)}
            />
          )}
          {isMelee(attackSkill) && (
            <Checkbox
              label="Non lethal damage with edged weapon"
              checked={attackSkill.attack.isNonLethal}
              onChange={() =>
                attackSkill.attack.set('isNonLethal', !attackSkill.attack.isNonLethal)
              }
            />
          )}

          <Checkbox
            label="Off Hand Attack"
            checked={attackSkill.attack.isOffHand}
            onChange={() => attackSkill.attack.set('isOffHand', !attackSkill.attack.isOffHand)}
          />
        </GridContainer>
      </fieldset>
    );
  }
}
