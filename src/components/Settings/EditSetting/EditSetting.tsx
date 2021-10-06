import { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { SettingForm } from '../SettingForm';
import { Isetting } from 'store/settings';
import { StoreContext } from 'components/StoreContext';
import { Istore } from 'store';
import { useHistory, useParams } from 'react-router-dom';
import { clone } from 'mobx-state-tree';

interface EditSettingProps {
  children?: React.ReactNode;
}

export const EditSetting = observer(function NewSettingFn({ ...otherProps }: EditSettingProps) {
  const store = useContext<Istore>(StoreContext);
  const history = useHistory();
  const { settingId } = useParams<{ settingId: string }>();
  const setting = useMemo(() => store.settings.get(settingId) as Isetting, [
    settingId,
    store.settings,
  ]);
  const copyOfSetting = useMemo(() => clone(setting), [setting]);
  return (
    <div {...otherProps}>
      <SettingForm
        setting={setting}
        title={`Edit ${copyOfSetting.name}`}
        saveSetting={() => {
          history.push('/settings');
        }}
        discardSetting={() => {
          store.settings.set(setting._id, copyOfSetting);
          history.push('/settings');
        }}
      />
    </div>
  );
});
