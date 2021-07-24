import { observer } from 'mobx-react';
import { Checkbox } from 'ui/Checkbox';
import { Iskill, isRangedAttack } from 'store/characters/skillModel';
import { TraitRollOptionsGrid } from '../../TraitRollOptionsGrid';

interface AttackerOptionsProps {
  attackSkill: Iskill;
}

export const AttackerOptions = observer(function AttackerOptionsFn({
  attackSkill,
  ...otherProps
}: AttackerOptionsProps) {
  return (
    <fieldset {...otherProps}>
      <legend>Attacker Options</legend>
      <TraitRollOptionsGrid>
        {isRangedAttack(attackSkill) && (
          <Checkbox
            label="Unstable Platform"
            checked={attackSkill.skillOptions.isUnstablePlatform}
            onChange={() =>
              attackSkill.skillOptions.set(
                'isUnstablePlatform',
                !attackSkill.skillOptions.isUnstablePlatform
              )
            }
          />
        )}
        <Checkbox
          label="Off Hand Attack"
          checked={attackSkill.skillOptions.isOffHand}
          onChange={() =>
            attackSkill.skillOptions.set('isOffHand', !attackSkill.skillOptions.isOffHand)
          }
        />
      </TraitRollOptionsGrid>
    </fieldset>
  );
});
