import React from 'react';
import { observer } from 'mobx-react-lite';

import { SWFormGroup } from 'ui/SWFormGroup/SWFormgroup';
import { Isetting } from 'store/settings';

interface SettingFormProps {
  setting?: Isetting;
}

export const SettingForm: React.FC<SettingFormProps> = observer(({ setting }) => {
  if (!setting) {
    return null;
  }

  return (
    <div>
      <SWFormGroup id="name" label="Name">
        <input
          type="text"
          id="name"
          placeholder="Setting name"
          value={setting.id}
          onChange={(event) => setting.set('id', event.target.value)}
        />
      </SWFormGroup>

      <hr />
      <h3>Creation Rules</h3>
      <SWFormGroup id="attributePoints" label="Attribute points">
        <input
          type="number"
          id="attributePoints"
          placeholder="5"
          value={setting.creation.attributePoints}
          onChange={(event) => setting.creation.set('attributePoints', Number(event.target.value))}
        />
      </SWFormGroup>
    </div>
  );
});
