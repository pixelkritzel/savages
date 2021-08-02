import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Select, { OptionsType, OptionTypeBase } from 'react-select';

import { FormGroup } from 'ui/FormGroup';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Imodifier } from 'store/modifiers';

interface GrantedPowersProps {
  modifier: Imodifier;
}

export const GrantedPowers = observer(function GrantedPowersFn({
  modifier,
  ...otherProps
}: GrantedPowersProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({
    get PowersOptions(): OptionsType<OptionTypeBase> {
      return store.selectedSetting.availablePowers.array.map(({ _id, name }) => ({
        label: name,
        value: _id,
      }));
    },
  }));
  return (
    <FormGroup
      label="Grants Powers"
      input={({ id }) => (
        <Select
          id={id}
          isMulti
          options={localStore.PowersOptions}
          onChange={(values) => {
            modifier.set(
              'grantedPowers',
              // @ts-expect-error
              { array: values.map(({ value }) => value) }
            );
          }}
        />
      )}
    />
  );
});
