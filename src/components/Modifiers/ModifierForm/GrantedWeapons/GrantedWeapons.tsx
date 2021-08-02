import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Select, { OptionsType, OptionTypeBase } from 'react-select';

import { FormGroup } from 'ui/FormGroup';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Imodifier } from 'store/modifiers';

interface GrantedWeaponsProps {
  modifier: Imodifier;
}

export const GrantedWeapons = observer(function GrantedWeaponsFn({
  modifier,
  ...otherProps
}: GrantedWeaponsProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({
    get weaponsOptions(): OptionsType<OptionTypeBase> {
      return store.selectedSetting.availableWeapons.map(({ _id, name }) => ({
        label: name,
        value: _id,
      }));
    },
  }));
  return (
    <FormGroup
      label="Grants Weapons"
      input={({ id }) => (
        <Select
          id={id}
          isMulti
          options={localStore.weaponsOptions}
          onChange={(values) => {
            modifier.set(
              'grantedWeapons',
              // @ts-expect-error
              { array: values.map(({ value }) => value) }
            );
          }}
        />
      )}
    />
  );
});
