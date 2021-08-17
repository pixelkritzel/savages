import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { EdgeForm } from '../EdgeForm';
import { Iedge } from 'store/edges';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory, useParams } from 'react-router-dom';
import { clone } from 'mobx-state-tree';

interface EditEdgeProps {
  children?: React.ReactNode;
}

export const EditEdge = observer(function NewEdgeFn({ ...otherProps }: EditEdgeProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { edgeId } = useParams<{ edgeId: string }>();
  const edge = useMemo(() => store.edges.get(edgeId) as Iedge, [edgeId, store.edges]);
  const copyOfEdge = useMemo(() => clone(edge), [edge]);
  return (
    <div {...otherProps}>
      <EdgeForm
        edge={edge}
        title={`Edit ${copyOfEdge.name}`}
        saveEdge={() => {
          store.edges.saveModel(edge._id);
          history.push('/edges');
        }}
        discardEdge={() => {
          store.edges.set(edge._id, copyOfEdge);
          history.push('/edges');
        }}
      />
    </div>
  );
});
