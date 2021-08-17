import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { clone } from 'mobx-state-tree';
import { useHistory, useParams } from 'react-router-dom';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { IbaseSkill } from 'store/skills';

import { SkillForm } from '../SkillForm';

export const EditSkill = observer(function NewModifierFn() {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { skillId } = useParams<{ skillId: string }>();
  const skill = useMemo(() => store.skills.get(skillId) as IbaseSkill, [skillId, store.skills]);
  const clonedSkill = useMemo(() => clone(skill), [skill]);
  return (
    <div>
      <SkillForm
        skill={skill}
        title={`Edit ${clonedSkill.name}`}
        saveSkill={() => {
          store.skills.saveModel(skill._id);
          history.push('/skills');
        }}
        discardSkill={() => {
          store.skills.set(skill._id, clonedSkill);
          history.push('/skills');
        }}
      />
    </div>
  );
});
