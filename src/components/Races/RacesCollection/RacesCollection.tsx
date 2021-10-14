import { useContext } from 'react';
import { observer } from 'mobx-react';

import { CRUDTable } from 'components/CRUDTable';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

interface RacesProps {}

export const RacesCollection = observer(function RacesFn({ ...otherProps }: RacesProps) {
  const { races } = useContext<Istore>(StoreContext);

  return (
    <CRUDTable
      // @ts-expect-error
      collection={races}
      baseUrl="races"
      newLinkLabel="Create new race"
      title="Races"
    />
  );
});
