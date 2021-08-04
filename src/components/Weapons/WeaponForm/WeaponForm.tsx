import { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';
import Select from 'react-select';

import { Box } from 'ui/Box';
import { Button } from 'ui/Button';
import { Checkbox } from 'ui/Checkbox';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { IncDec } from 'ui/IncDec';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Iweapon } from 'store/weapons';

interface WeaponFormProps {
  title: string;
  weapon: Iweapon;
  saveWeapon: () => void;
  discardWeapon: () => void;
}

export const WeaponForm = observer(function WeaponFormFn({
  weapon,
  title,
  saveWeapon,
  discardWeapon,
  ...otherProps
}: WeaponFormProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({}));

  return (
    <form>
      <h1>{title}</h1>

      <Button variant="danger" size="big" onClick={() => discardWeapon()}>
        Cancel
      </Button>
      <Button variant="success" size="big" onClick={() => saveWeapon()}>
        Save Weapon
      </Button>
    </form>
  );
});
