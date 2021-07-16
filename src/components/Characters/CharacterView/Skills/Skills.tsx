import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Icharacter } from 'store/characters';
import { Iskill } from 'store/characters/skillModel';

import { mapToArray } from 'utils/mapToArray';

interface SkillsProps {
  character: Icharacter;
}

const Table = styled.table`
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;

  th,
  td {
    padding-left: 6px;
    border: 1px solid black;
    text-align: left;
  }
`;

export const Skills: React.FC<SkillsProps> = observer(({ character }) => {
  return (
    <div>
      <h3>Skills</h3>
      <Table>
        <thead>
          <th>Skill</th>
          <th>Specialization</th>
          <th>Dice</th>
        </thead>
        <tbody>
          {mapToArray<Iskill>(character.skills).map(({ settingSkill, value, specializations }) => (
            <tr key={settingSkill.id}>
              <td>{settingSkill.name}</td>
              <td>{specializations?.join(' ')}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});
