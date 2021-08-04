import { useContext } from 'react';
import { observer } from 'mobx-react';

import { CRUDTable } from 'components/CRUDTable';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

interface WeaponsProps {}

export const WeaponsCollection = observer(function WeaponsFn({ ...otherProps }: WeaponsProps) {
  const { weapons } = useContext<Istore>(StoreContext);

  return (
    <CRUDTable
      // @ts-expect-error
      collection={weapons}
      baseUrl="weapons"
      newLinkLabel="Create new weapon"
      title="Weapons"
    />
  );
});
