import React from 'react';
import { observer } from 'mobx-react';
import { Box } from 'ui/Box';
import { Icharacter } from 'store/characters';
import styled from 'styled-components/macro';
import { Checkbox } from 'ui/Checkbox';

interface StatesProps {
  character: Icharacter;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px;
  row-gap: ${({ theme }) => theme.rhythms.inside.vertical}px;
`;

const StyledCheckbox = styled(Checkbox)`
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const States = observer(function StatesFn({ character, ...otherProps }: StatesProps) {
  const { states } = character;
  return (
    <Box title="States" {...otherProps}>
      <GridContainer>
        <Centered>
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
        </Centered>
        <Centered>
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
        </Centered>
        <Centered>
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
        </Centered>
        <Checkbox
          label="Shaken"
          checked={states.isShaken}
          onChange={() => states.set('isShaken', !states.isShaken)}
        />
        <Checkbox
          label="Distracted"
          checked={states.isDistracted}
          onChange={() => states.set('isDistracted', !states.isDistracted)}
        />
        <Checkbox
          label="Entangled"
          checked={states.isEntangled}
          onChange={() => states.set('isEntangled', !states.isEntangled)}
        />
        <Checkbox
          label="Stunned"
          checked={states.isStunned}
          onChange={() => states.set('isStunned', !states.isStunned)}
        />
        <Checkbox
          label="Vulnerable"
          checked={states.isVulnerable}
          onChange={() => states.set('isVulnerable', !states.isVulnerable)}
        />
        <Checkbox
          label="Bound"
          checked={states.isBound}
          onChange={() => states.set('isBound', !states.isBound)}
        />
      </GridContainer>
    </Box>
  );
});
