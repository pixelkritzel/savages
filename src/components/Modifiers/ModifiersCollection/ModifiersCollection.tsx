import { useContext } from 'react';
import { observer } from 'mobx-react';

import { CRUDTable } from 'components/CRUDTable';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

interface ModifiersProps {}

export const ModifiersCollection = observer(function ModifiersFn({
  ...otherProps
}: ModifiersProps) {
  const { modifiers } = useContext<Istore>(StoreContext);

  return (
    <CRUDTable
      collection={modifiers}
      baseUrl="modifiers"
      newLinkLabel="Create new modifier"
      title="Modifiers"
    />
  );
});
