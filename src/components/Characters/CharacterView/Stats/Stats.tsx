import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import cx from 'classnames';

import CSS from './Stats.module.scss';

import { Icharacter } from 'store/characters';
import { observer } from 'mobx-react';

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
  ({ character, className, isEdit = false, ...otherProps }) => {
    return (
      <div className={cx(CSS.stats, className)}>
        <DL>
          <dt>Toughness</dt>
          <dd>{character.toughness}</dd>

          <dt>Parry</dt>
          <dd>{character.parry}</dd>

          <dt>Pace</dt>
          <dd>{character.pace}</dd>
        </DL>
      </div>
    );
  }
);
