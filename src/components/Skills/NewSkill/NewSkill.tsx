import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SkillForm } from '../SkillForm';
import { baseSkillModel, createBaseSkillScaffold } from 'store/skills';
import { useContext } from 'react';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { action } from 'mobx';
import { useHistory } from 'react-router-dom';

interface NewSkillProps {
  children?: React.ReactNode;
}

export const NewSkill = observer(function NewSkillFn({ ...otherProps }: NewSkillProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({
    newSkill: baseSkillModel.create(createBaseSkillScaffold()),
  }));
  const history = useHistory();

  const saveSkill = action(() => {
    store.skills.add(localStore.newSkill);
    history.push('/skills');
  });

  const discardSkill = () => history.push('/skills');

  return (
    <div {...otherProps}>
      <SkillForm
        skill={localStore.newSkill}
        saveSkill={saveSkill}
        discardSkill={discardSkill}
        title="New skill"
      />
    </div>
  );
});
