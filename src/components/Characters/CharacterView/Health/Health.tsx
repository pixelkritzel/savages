import React from 'react';

import { Checkbox } from 'ui/Checkbox';

import { Icharacter } from 'store/characters';
import styled from 'styled-components';
import { CharacterViewBox } from '../CharacterViewBox';

const StyledHealth = styled(CharacterViewBox)`
  text-align: center;

  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

interface HealthProps extends React.HTMLProps<HTMLDivElement> {
  character: Icharacter;
}

export const Health: React.FC<HealthProps> = ({ character, ...otherProps }) => {
  return (
    <div {...otherProps}>
      <StyledHealth headline="Health">
        <div>
          <strong>Wounds</strong>
          <div>
            {character.wounds.map((_, woundIndex) => (
              <StyledCheckbox
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
        <div>
          <strong>Fatigue</strong>
          <div>
            {character.fatigue.map((_, fatigueIndex) => (
              <StyledCheckbox
                checked={character.fatigue[fatigueIndex] || undefined}
                label={fatigueIndex + 1}
                type="checkbox"
                id={`fatigue-${fatigueIndex}`}
                key={`fatigue-${fatigueIndex}`}
                onChange={() =>
                  character.set(
                    'fatigue',
                    character.fatigue.map((existingFatique, existingfatigueIndex) =>
                      existingfatigueIndex === fatigueIndex ? !existingFatique : existingFatique
                    ) as any
                  )
                }
              />
            ))}
          </div>
        </div>
        <div>
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
      </StyledHealth>
    </div>
  );
};
