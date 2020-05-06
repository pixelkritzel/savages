import React from 'react';

import { Imodifier } from 'store/modifier';

interface ModiferViewProps {
  modifier: Imodifier;
}

export const ModifierView: React.FC<ModiferViewProps> = ({ modifier }) => (
  <div>
    {modifier.modifications.length > 0 && (
      <dl>
        {modifier.modifications.map(({ name, value }) => (
          <React.Fragment key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
    )}
  </div>
);
