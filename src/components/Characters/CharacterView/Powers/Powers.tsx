import React from 'react';
import { observer } from 'mobx-react';

interface PowersProps {}

export const Powers: React.FC<PowersProps> = observer(({ ...otherProps }) => {
  return <div {...otherProps}>Powers</div>;
});
