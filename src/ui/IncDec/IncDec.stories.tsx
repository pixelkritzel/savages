import React, { useState } from 'react';

import { IncDec } from './IncDec';

export default {
  title: 'IncDec',
};

export const defaultView: React.FC = () => {
  const [value, setValue] = useState(0); //eslint-disable-line react-hooks/rules-of-hooks
  return (
    <IncDec
      disableDecrement={value < -5}
      disableIncrement={value > 5}
      onDecrement={() => setValue(value - 1)}
      onIncrement={() => setValue(value + 1)}
      value={value.toString()}
    />
  );
};
