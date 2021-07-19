import React from 'react';
import { observer } from 'mobx-react';

import Tippy, { TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export const Popover: React.FC<TippyProps> = observer(({ children, ...props }) => {
  return <Tippy {...props}>{children}</Tippy>;
});
