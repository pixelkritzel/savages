import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Select, { OptionsType, OptionTypeBase } from 'react-select';

import { FormGroup } from 'ui/FormGroup';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Imodifier } from 'store/modifiers';
import { Ihindrance } from 'store/hindrances';

interface AddedHindrancesProps {
  modifier: Imodifier;
}

export const AddedHindrances = observer(function AddedHindrancesFn({
  modifier,
  ...otherProps
}: AddedHindrancesProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({
    get hindrancesOptions(): OptionsType<OptionTypeBase> {
      return store.selectedSetting.availableHindrances.array.map(({ _id, name }: Ihindrance) => ({
        label: name,
        value: _id,
      }));
    },
  }));
  return (
    <FormGroup
      label="Added Hindrances"
      input={({ id }) => (
        <Select
          id={id}
          isMulti
          options={localStore.hindrancesOptions}
          onChange={(values) => {
            modifier.set(
              'addedHindrances',
              // @ts-expect-error
              { array: values.map(({ value }) => value) }
            );
          }}
        />
      )}
    />
  );
});
