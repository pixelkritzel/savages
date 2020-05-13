import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from 'ui/Button';

import { SettingForm } from 'components/Settings/SettingForm';
import { StoreContext } from 'components/StoreContext';

export const NewSetting: React.FC = () => {
  const history = useHistory();
  const { settings } = useContext(StoreContext);

  useEffect(() => {
    settings.new();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <h2>Create a new character</h2>

      <SettingForm setting={settings.newModel!} />

      <div className="pull-right">
        <Button
          onClick={() => {
            if (window.confirm('Are you sure?')) {
              settings.discardNewModel();
              history.replace(`/characters`);
            }
          }}
          type="button"
        >
          Discard Character
        </Button>
        <Button
          onClick={async () => {
            if ((await settings.saveNewModel()) === 'SUCCESS') {
              history.replace(`/characters`);
            }
          }}
          type="button"
        >
          Save character
        </Button>
      </div>
    </form>
  );
};
