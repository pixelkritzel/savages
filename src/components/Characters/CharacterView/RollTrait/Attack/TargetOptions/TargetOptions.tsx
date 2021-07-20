import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Checkbox } from 'ui/Checkbox';
import { Iskill, isMelee } from 'store/characters/skillModel';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

interface TargetOptionsProps {
  attackSkill: Iskill;
}

export const TargetOptions: React.FC<TargetOptionsProps> = observer(
  ({ attackSkill, ...otherProps }) => {
    return (
      <fieldset {...otherProps}>
        <legend>Target Options</legend>
        <GridContainer>
          <Checkbox
            label="The Drop"
            checked={attackSkill.attack.isTheDrop}
            onChange={() => attackSkill.attack.set('isTheDrop', !attackSkill.attack.isTheDrop)}
          />

          <Checkbox
            label="Prone Target"
            checked={attackSkill.attack.isProneTarget}
            onChange={() =>
              attackSkill.attack.set('isProneTarget', !attackSkill.attack.isProneTarget)
            }
          />

          {isMelee(attackSkill) && (
            <Checkbox
              label="Unarmed Defender"
              checked={attackSkill.attack.isUnarmedDefender}
              onChange={() =>
                attackSkill.attack.set('isUnarmedDefender', !attackSkill.attack.isUnarmedDefender)
              }
            />
          )}
        </GridContainer>
      </fieldset>
    );
  }
);
