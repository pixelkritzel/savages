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
            checked={attackSkill.attackOptions.isUnstablePlatform}
            onChange={() =>
              attackSkill.attackOptions.set(
                'isUnstablePlatform',
                !attackSkill.attackOptions.isUnstablePlatform
              )
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
      </TraitRollOptionsGrid>
    </fieldset>
  );
});
