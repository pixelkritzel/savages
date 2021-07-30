import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { Icharacter } from 'store/characters';
import { observer } from 'mobx-react';
import { CharacterViewBox } from '../CharacterViewBox';

interface StatsProps extends HTMLAttributes<HTMLDivElement> {
  character: Icharacter;
  isEdit: boolean;
}

const DL = styled.dl`
  display: flex;
  flex-wrap: wrap;

  dt {
    width: 80%;
    font-weight: bold;
  }

  dd {
    width: 20%;
  }
`;

export const Stats: React.FC<StatsProps> = observer(
  ({ character, isEdit = false, ...otherProps }) => {
    return (
      <div {...otherProps}>
        <CharacterViewBox headline="Stats">
          <DL>
            <dt>Toughness</dt>
            <dd>{character.toughness}</dd>
            <dt>Parry</dt>
            <dd>{character.parry}</dd>
            <dt>Pace</dt>
            <dd>{character.pace}</dd>
          </DL>
        </CharacterViewBox>
      </div>
    );
  }
);
