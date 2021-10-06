import { useContext } from 'react';
import { observer } from 'mobx-react';

import { CRUDTable } from 'components/CRUDTable';
import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

interface SettingsProps {}

export const SettingsCollection = observer(function SettingsFn({ ...otherProps }: SettingsProps) {
  const { settings } = useContext<Istore>(StoreContext);

  return (
    <CRUDTable
      // @ts-expect-error
      collection={settings}
      baseUrl="settings"
      newLinkLabel="Create new setting"
      title="Settings"
    />
  );
});
