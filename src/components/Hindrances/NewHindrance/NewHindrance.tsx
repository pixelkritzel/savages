import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { HindranceForm } from '../HindranceForm';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

interface NewHindranceProps {
  children?: React.ReactNode;
}

export const NewHindrance = observer(function NewHindranceFn({ ...otherProps }: NewHindranceProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  useEffect(() => {
    store.hindrances.new();
    return () => {
      store.hindrances.discardNewModel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...otherProps}>
      {store.hindrances.newModel && (
        <HindranceForm
          hindrance={store.hindrances.newModel}
          title="New hindrance"
          saveHindrance={() => {
            store.hindrances.saveNewModel();
            history.push('/hindrances');
          }}
          discardHindrance={() => {
            store.hindrances.discardNewModel();
            history.push('/hindrances');
          }}
        />
      )}
    </div>
  );
});
