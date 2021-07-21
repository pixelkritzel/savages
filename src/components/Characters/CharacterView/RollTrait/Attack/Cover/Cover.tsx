import React from 'react';
import { observer } from 'mobx-react';
import { Iskill } from 'store/characters/skillModel';

interface CoverProps {
  shooting: Iskill;
}

export const Cover: React.FC<CoverProps> = observer(({ shooting, ...otherProps }) => {
  function setCover(value: Iskill['attackOptions']['cover']) {
    shooting.attackOptions.set('cover', shooting.attackOptions.cover === value ? null : value);
  }

  return (
    <fieldset>
      <legend>Cover</legend>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.cover === '-2'}
          onChange={() => setCover('-2')}
        />{' '}
        Light
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.cover === '-4'}
          onChange={() => setCover('-4')}
        />{' '}
        Medium
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.cover === '-6'}
          onChange={() => setCover('-6')}
        />{' '}
        Heavy
      </label>
      <label>
        <input
          type="checkbox"
          checked={shooting.attackOptions.cover === '-8'}
          onChange={() => setCover('-8')}
        />{' '}
        Near Total
      </label>
    </fieldset>
  );
});
