import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { HindranceForm } from '../HindranceForm';
import { Ihindrance } from 'store/hindrances';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory, useParams } from 'react-router-dom';
import { clone } from 'mobx-state-tree';

interface EditHindranceProps {
  children?: React.ReactNode;
}

export const EditHindrance = observer(function NewHindranceFn({
  ...otherProps
}: EditHindranceProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { hindranceId } = useParams<{ hindranceId: string }>();
  const hindrance = useMemo(() => store.hindrances.get(hindranceId) as Ihindrance, [
    hindranceId,
    store.hindrances,
  ]);
  const copyOfHindrance = useMemo(() => clone(hindrance), [hindrance]);
  return (
    <div {...otherProps}>
      <HindranceForm
        hindrance={hindrance}
        title={`Edit ${copyOfHindrance.name}`}
        saveHindrance={() => {
          history.push('/hindrances');
        }}
        discardHindrance={() => {
          store.hindrances.set(hindrance._id, copyOfHindrance);
          history.push('/hindrances');
        }}
      />
    </div>
  );
});
