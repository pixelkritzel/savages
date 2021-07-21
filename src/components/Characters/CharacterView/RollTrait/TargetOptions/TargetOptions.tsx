import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Checkbox } from 'ui/Checkbox';
import { isAttackSkill, isMelee, isSkill } from 'store/characters/skillModel';
import { Itrait } from 'store/characters/traitModel';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

interface TargetOptionsProps {
  trait: Itrait;
}

export const TargetOptions: React.FC<TargetOptionsProps> = observer(({ trait, ...otherProps }) => {
  return (
    <fieldset {...otherProps}>
      <legend>Target Options</legend>
      <GridContainer>
        {isSkill(trait) && isAttackSkill(trait) && (
          <Checkbox
            label="The Drop"
            checked={trait.attackOptions.isTheDrop}
            onChange={() => trait.attackOptions.set('isTheDrop', !trait.attackOptions.isTheDrop)}
          />
        )}

        {isSkill(trait) && isAttackSkill(trait) && (
          <Checkbox
            label="Prone Target"
            checked={trait.attackOptions.isProneTarget}
            onChange={() =>
              trait.attackOptions.set('isProneTarget', !trait.attackOptions.isProneTarget)
            }
          />
        )}

        {isSkill(trait) && isAttackSkill(trait) && isMelee(trait) && (
          <Checkbox
            label="Unarmed Defender"
            checked={trait.attackOptions.isUnarmedDefender}
            onChange={() =>
              trait.attackOptions.set('isUnarmedDefender', !trait.attackOptions.isUnarmedDefender)
            }
          />
        )}
        <Checkbox
          label="Vulnerable Target"
          checked={trait.options.isVulnerableTarget}
          onChange={() =>
            trait.options.set('isVulnerableTarget', !trait.options.isVulnerableTarget)
          }
        />
      </GridContainer>
    </fieldset>
  );
});
