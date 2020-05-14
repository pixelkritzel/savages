import React from 'react';
import { Button } from './Button';

import { BsPencil } from 'react-icons/bs';

export default {
  title: 'Button',
};

export const normal = () => <Button>Hello Button</Button>;
export const disabled = () => (
  <>
    <Button disabled>Hello Button</Button>
    <br />
    <br />
    <Button disabled variant="danger">
      Dangerous Button
    </Button>
    <br />
    <br />
    <Button disabled variant="success">
      Successful Button
    </Button>
    <br />
    <br />
    <Button disabled variant="link">
      Button looks like a link
    </Button>
  </>
);

export const danger = () => <Button variant="danger">Dangerous Button</Button>;

export const success = () => <Button variant="success">Successful Button</Button>;

export const withIconDefault = () => <Button icon={<BsPencil />}>Successful Button</Button>;

export const withIconDanger = () => (
  <Button icon={<BsPencil />} variant="success">
    Successful Button
  </Button>
);

export const link = () => <Button variant="link">Button looks like a link</Button>;

export const linkWithIcon = () => (
  <Button title="edit" icon={<BsPencil />} variant="link">
    With Icon
  </Button>
);
