import { useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';

import { Alert } from 'ui/Alert';
import { Button } from 'ui/Button';
import { FormGroup } from 'ui/FormGroup';

import { getSpentAmmunitionByRateOfFire, Iweapon } from 'store/weapons/weaponModel';
import { Iskill } from 'store/characters/skillModel';
import { IskillOptions } from 'store/characters/skillOptions';

import { generateId } from 'utils/generateId';

const Container = styled.div`
  grid-area: 3 / 1 / 3 / 4;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 18px;
  align-items: center;
`;

const Ammunition = styled.div`
  justify-self: center;
`;

const ReloadItem = styled.div`
  justify-self: right;
`;

interface RateOfFireAndReloadProps {
  attackSkill: Iskill;
  weapon: Iweapon;
}

export const RateOfFireAndReload = observer(function RateOfFireAndReloadFn({
  attackSkill,
  weapon,
  ...otherProps
}: RateOfFireAndReloadProps) {
  const { current: rateOfFireTicksId } = useRef(generateId());
  const { spendAmmunition } = useLocalStore(() => ({
    get spendAmmunition() {
      return attackSkill.skillOptions.isSupressiveFire
        ? getSpentAmmunitionByRateOfFire({
            rateOfFire: weapon.rateOfFire,
            isThreeRoundBurst: false,
          }) * 3
        : getSpentAmmunitionByRateOfFire({
            rateOfFire: attackSkill.skillOptions.rateOfFire,
            isThreeRoundBurst: attackSkill.skillOptions.isThreeRoundBurst,
          });
    },
  }));

  return (
    <Container {...otherProps}>
      {weapon.maxRateOfFire > 1 && (
        <div>
          <FormGroup
            label={<>{`Rate of Fire: ${attackSkill.skillOptions.rateOfFire}`}</>}
            input={({ id }) => (
              <>
                <input
                  type="range"
                  min={1}
                  id={id}
                  max={weapon.maxRateOfFire}
                  step={1}
                  value={attackSkill.skillOptions.rateOfFire}
                  onChange={(event) =>
                    attackSkill.skillOptions.set(
                      'rateOfFire',
                      Number(event.target.value) as IskillOptions['rateOfFire']
                    )
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
          {attackSkill.skillOptions.rateOfFire > weapon.rateOfFire && (
            <Alert>The selected Rate of Fire is higher than the weapons Rate of Fire!</Alert>
          )}
        </div>
      )}
      <Ammunition>
        {spendAmmunition <= weapon.remainingAmmunition
          ? `Will spent ${spendAmmunition} rounds`
          : 'Need to reload'}
      </Ammunition>
      <ReloadItem>
        <Button onClick={() => weapon.reload()}>Reload</Button>
      </ReloadItem>
    </Container>
  );
});
