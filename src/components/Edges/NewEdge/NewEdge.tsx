import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { EdgeForm } from '../EdgeForm';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

interface NewEdgeProps {
  children?: React.ReactNode;
}

export const NewEdge = observer(function NewEdgeFn({ ...otherProps }: NewEdgeProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => store.edges.new(), []);

  return (
    <div {...otherProps}>
      {store.edges.newModel && (
        <EdgeForm
          edge={store.edges.newModel}
          title="New edge"
          saveEdge={() => {
            store.edges.saveNewModel();
            history.push('/edges');
          }}
          discardEdge={() => {
            store.edges.discardNewModel();
            history.push('/edges');
          }}
        />
      )}
    </div>
  );
});
