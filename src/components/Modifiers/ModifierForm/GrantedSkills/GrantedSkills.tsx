import React, { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Select, { OptionsType, OptionTypeBase } from 'react-select';

import { FormGroup } from 'ui/FormGroup';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Imodifier } from 'store/modifiers';

interface GrantedSkillsProps {
  modifier: Imodifier;
}

export const GrantedSkills = observer(function GrantedSkillsFn({
  modifier,
  ...otherProps
}: GrantedSkillsProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({
    get SkillsOptions(): OptionsType<OptionTypeBase> {
      return store.selectedSetting.availableSkills.array.map(({ _id, name }) => ({
        label: name,
        value: _id,
      }));
    },
  }));
  return (
    <FormGroup
      label="Grants Skills"
      input={({ id }) => (
        <Select
          id={id}
          isMulti
          options={localStore.SkillsOptions}
          onChange={(values) => {
            modifier.set(
              'grantedSkills',
              // @ts-expect-error
              { array: values.map(({ value }) => value) }
            );
          }}
        />
      )}
    />
  );
});
