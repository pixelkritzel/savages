import { useContext } from 'react';
import { observer } from 'mobx-react';

import { CRUDTable } from 'components/CRUDTable';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

interface EdgesProps {}

export const EdgesCollection = observer(function EdgesFn({ ...otherProps }: EdgesProps) {
  const { edges } = useContext<Istore>(StoreContext);

  return (
    <CRUDTable
      // @ts-expect-error
      collection={edges}
      baseUrl="edges"
      newLinkLabel="Create new edge"
      title="Edges"
    />
  );
});
