import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { WeaponForm } from '../WeaponForm';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

interface NewWeaponProps {
  children?: React.ReactNode;
}

export const NewWeapon = observer(function NewWeaponFn({ ...otherProps }: NewWeaponProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  useEffect(() => {
    store.weapons.new();
    return () => {
      store.weapons.discardNewModel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...otherProps}>
      {store.weapons.newModel && (
        <WeaponForm
          weapon={store.weapons.newModel}
          title="New weapon"
          saveWeapon={() => {
            store.weapons.saveNewModel();
            history.push('/weapons');
          }}
          discardWeapon={() => {
            store.weapons.discardNewModel();
            history.push('/weapons');
          }}
        />
      )}
    </div>
  );
});
