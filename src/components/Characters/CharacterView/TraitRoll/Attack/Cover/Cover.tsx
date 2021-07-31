import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Iskill } from 'store/characters/skillModel';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  row-gap: ${({ theme }) => theme.rhythms.inside.vertical}px;
  column-gap: ${({ theme }) => theme.rhythms.inside.horizontal}px;
`;

interface CoverProps {
  attackSkill: Iskill;
}

export const Cover: React.FC<CoverProps> = observer(({ attackSkill, ...otherProps }) => {
  function setCover(value: Iskill['skillOptions']['cover']) {
    attackSkill.skillOptions.set('cover', attackSkill.skillOptions.cover === value ? null : value);
  }

  return (
    <fieldset>
      <legend>Cover</legend>
      <GridContainer>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.cover === '-2'}
            onChange={() => setCover('-2')}
          />{' '}
          Light
        </label>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.cover === '-4'}
            onChange={() => setCover('-4')}
          />{' '}
          Medium
        </label>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.cover === '-6'}
            onChange={() => setCover('-6')}
          />{' '}
          Heavy
        </label>
        <label>
          <input
            type="checkbox"
            checked={attackSkill.skillOptions.cover === '-8'}
            onChange={() => setCover('-8')}
          />{' '}
          Near Total
        </label>
      </GridContainer>
    </fieldset>
  );
});
