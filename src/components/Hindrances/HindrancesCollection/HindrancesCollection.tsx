import { useContext } from 'react';
import { observer } from 'mobx-react';

import { CRUDTable } from 'components/CRUDTable';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

interface HindrancesProps {}

export const HindrancesCollection = observer(function HindrancesFn({
  ...otherProps
}: HindrancesProps) {
  const { hindrances } = useContext<Istore>(StoreContext);

  return (
    <CRUDTable
      // @ts-expect-error
      collection={hindrances}
      baseUrl="hindrances"
      newLinkLabel="Create new hindrance"
      title="Hindrances"
    />
  );
});
