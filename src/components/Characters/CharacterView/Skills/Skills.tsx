import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { SkillRoll } from './SkillRoll';

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
          <tr>
            <th>Skill</th>
            <th>Specialization</th>
            <th>Dice</th>
          </tr>
        </thead>
        <tbody>
          {mapToArray<Iskill>(character.skills).map((skill) => (
            <tr key={skill.settingSkill.id}>
              <td>{skill.settingSkill.name}</td>
              <td>{skill.specializations?.join(' ')}</td>
              <td>
                <SkillRoll character={character} skill={skill} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});
