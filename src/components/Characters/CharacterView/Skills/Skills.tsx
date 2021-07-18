import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from 'components/StoreContext';

import { Table } from 'ui/Table';

import { Istore } from 'store';
import { Icharacter } from 'store/characters';
import { Iskill } from 'store/characters/skillModel';

import { SkillRoll } from './SkillRoll';

import { mapToArray } from 'utils/mapToArray';

interface SkillsProps {
  character: Icharacter;
}

export const Skills: React.FC<SkillsProps> = observer(({ character }) => {
  const { selectedSetting } = useContext<Istore>(StoreContext);

  return (
    <div>
      <h3>Skills</h3>
      <Table>
        <thead>
          <tr>
            <th>Skill</th>
            {selectedSetting.isSkillSpezializations && <th>Specialization</th>}
            <th>Dice</th>
          </tr>
        </thead>
        <tbody>
          {mapToArray<Iskill>(character.skills).map((skill) => (
            <tr key={skill.settingSkill.id}>
              <td>{skill.settingSkill.name}</td>
              {selectedSetting.isSkillSpezializations && (
                <td>{skill.specializations?.join(' ')}</td>
              )}
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
