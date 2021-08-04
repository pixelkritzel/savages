import React, { useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import { WeaponForm } from '../WeaponForm';
import { weaponModel, createWeaponScaffold } from 'store/weapons';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory } from 'react-router-dom';

interface NewWeaponProps {
  children?: React.ReactNode;
}

export const NewWeapon = observer(function NewWeaponFn({ ...otherProps }: NewWeaponProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { current: weapon } = useRef(weaponModel.create(createWeaponScaffold()));
  return (
    <div {...otherProps}>
      <WeaponForm
        weapon={weapon}
        title="New weapon"
        saveWeapon={() => {
          store.weapons.add(weapon);
          history.push('/weapons');
        }}
        discardWeapon={() => {
          history.push('/weapons');
        }}
      />
    </div>
  );
});
