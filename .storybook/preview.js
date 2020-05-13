import React from 'react';

import { addDecorator } from '@storybook/react';

import '../src/styles/styles.scss';

addDecorator((storyFn) => <div style={{ margin: '16px 32px' }}>{storyFn()}</div>);
