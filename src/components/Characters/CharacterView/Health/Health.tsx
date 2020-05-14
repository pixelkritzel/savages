import React from 'react';
import cx from 'classnames';

import { Checkbox } from 'ui/Checkbox';

import { Icharacter } from 'store/characters';

import CSS from './Health.module.scss';

export const Health: React.FC<{
  character: Icharacter;
}> = ({ character }) => {
  return (
    <div className={cx(CSS.health, CSS.box)}>
      <h3>Health</h3>
      <div className="pull-apart">
        <strong>Wounds</strong>
        <div>
          {character.wounds.map((_, woundIndex) => (
            <Checkbox
              className={CSS.checkbox}
              checked={character.wounds[woundIndex] || undefined}
              label={woundIndex + 1}
              type="checkbox"
              id={`wound-${woundIndex}`}
              key={`wound-${woundIndex}`}
              onChange={() =>
                character.set(
                  'wounds',
                  character.wounds.map((existingWound, existingWoundIndex) =>
                    existingWoundIndex === woundIndex ? !existingWound : existingWound
                  ) as any
                )
              }
            />
          ))}
        </div>
      </div>
      <div className="pull-apart">
        <strong>Incapacitaded</strong>
        <div>
          <Checkbox
            checked={character.incapcitaded || undefined}
            label=""
            type="checkbox"
            id="incapacitaded"
            onChange={() => character.set('incapcitaded', !character.incapcitaded)}
          />
        </div>
      </div>
      <div className="pull-apart">
        <strong>Fatigue</strong>

        <div>
          {character.fatigue.map((_, fatigueIndex) => (
            <Checkbox
              className={CSS.checkbox}
              checked={character.wounds[fatigueIndex] || undefined}
              label={fatigueIndex + 1}
              type="checkbox"
              id={`fatigue-${fatigueIndex}`}
              key={`fatigue-${fatigueIndex}`}
              onChange={() =>
                character.set(
                  'fatigue',
                  character.wounds.map((existingWound, existingfatigueIndex) =>
                    existingfatigueIndex === fatigueIndex ? !existingWound : existingWound
                  ) as any
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
