import { observer } from 'mobx-react';
import { Checkbox } from 'ui/Checkbox';
import { Iskill, isRangedAttack } from 'store/characters/skillModel';
import { TraitRollOptionsGrid } from '../../TraitRollOptionsGrid';
import { FormGroup } from 'ui/FormGroup';

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
        {attackSkill.name === 'fighting' && (
          <FormGroup
            label={`Gang Up Bonus: ${attackSkill.skillOptions.gangUp}`}
            input={({ id }) => (
              <input
                id={id}
                type="range"
                value={attackSkill.skillOptions.gangUp}
                step={1}
                min={0}
                max={4}
                onChange={(event) =>
                  attackSkill.skillOptions.set('gangUp', Number(event.target.value))
                }
              />
            )}
          />
        )}
      </TraitRollOptionsGrid>
    </fieldset>
  );
});
