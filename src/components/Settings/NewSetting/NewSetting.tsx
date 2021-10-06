import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { SettingForm } from '../SettingForm';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

interface NewSettingProps {
  children?: React.ReactNode;
}

export const NewSetting = observer(function NewSettingFn({ ...otherProps }: NewSettingProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => store.settings.new(), []);

  return (
    <div {...otherProps}>
      {store.settings.newModel && (
        <SettingForm
          setting={store.settings.newModel}
          title="New setting"
          saveSetting={() => {
            store.settings.saveNewModel();
            history.push('/settings');
          }}
          discardSetting={() => {
            store.settings.discardNewModel();
            history.push('/settings');
          }}
        />
      )}
    </div>
  );
});
