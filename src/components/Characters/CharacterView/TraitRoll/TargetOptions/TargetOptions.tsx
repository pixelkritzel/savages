import React from 'react';
import { observer } from 'mobx-react';

import { Checkbox } from 'ui/Checkbox';
import { TraitRollOptionsGrid } from '../TraitRollOptionsGrid';

import { isAttackSkill, isMelee, isSkill } from 'store/characters/skillModel';
import { Itrait } from 'store/characters/traitModel';

interface TargetOptionsProps {
  trait: Itrait;
}

export const TargetOptions: React.FC<TargetOptionsProps> = observer(({ trait, ...otherProps }) => {
  return (
    <fieldset {...otherProps}>
      <legend>Target Options</legend>
      <TraitRollOptionsGrid>
        {isSkill(trait) && isAttackSkill(trait) && (
          <Checkbox
            label="The Drop"
            checked={trait.skillOptions.isTheDrop}
            onChange={() => trait.skillOptions.set('isTheDrop', !trait.skillOptions.isTheDrop)}
          />
        )}

        {isSkill(trait) && isAttackSkill(trait) && (
          <Checkbox
            label="Prone Target"
            checked={trait.skillOptions.isProneTarget}
            onChange={() =>
              trait.skillOptions.set('isProneTarget', !trait.skillOptions.isProneTarget)
            }
          />
        )}

        {isSkill(trait) && isAttackSkill(trait) && isMelee(trait) && (
          <Checkbox
            label="Unarmed Defender"
            checked={trait.skillOptions.isUnarmedDefender}
            onChange={() =>
              trait.skillOptions.set('isUnarmedDefender', !trait.skillOptions.isUnarmedDefender)
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
      </TraitRollOptionsGrid>
    </fieldset>
  );
});
