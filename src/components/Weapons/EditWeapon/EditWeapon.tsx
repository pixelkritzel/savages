import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { WeaponForm } from '../WeaponForm';
import { Iweapon } from 'store/weapons';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory, useParams } from 'react-router-dom';
import { clone } from 'mobx-state-tree';

interface EditWeaponProps {
  children?: React.ReactNode;
}

export const EditWeapon = observer(function NewWeaponFn({ ...otherProps }: EditWeaponProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { weaponId } = useParams<{ weaponId: string }>();
  const weapon = useMemo(() => store.weapons.get(weaponId) as Iweapon, [weaponId, store.weapons]);
  const copyOfWeapon = useMemo(() => clone(weapon), [weapon]);
  return (
    <div {...otherProps}>
      <WeaponForm
        weapon={weapon}
        title={`Edit ${copyOfWeapon.name}`}
        saveWeapon={() => {
          store.weapons.saveModel(weapon._id);
          history.push('/weapons');
        }}
        discardWeapon={() => {
          store.weapons.set(weapon._id, copyOfWeapon);
          history.push('/weapons');
        }}
      />
    </div>
  );
});
