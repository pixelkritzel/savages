import { useContext } from 'react';
import { observer } from 'mobx-react';

import { CRUDTable } from 'components/CRUDTable';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

interface SkillsProps {}

export const SkillsCollection = observer(function SkillsFn({ ...otherProps }: SkillsProps) {
  const { skills } = useContext<Istore>(StoreContext);

  return (
    <CRUDTable
      // @ts-expect-error
      collection={skills}
      baseUrl="skills"
      newLinkLabel="Create new skill"
      title="Skills"
    />
  );
});
