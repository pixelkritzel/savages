import React from 'react';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormGroupProps } from 'react-bootstrap/FormGroup';
import Row from 'react-bootstrap/Row';

export const SWFormGroup: React.FC<
  FormGroupProps & { className?: string; label: string | JSX.Element }
> = ({ children, controlId, label, ...otherProps }) => (
  <Form.Group as={Row} controlId={controlId} {...otherProps}>
    <Form.Label column md={6}>
      {label}
    </Form.Label>
    <Col md={6}>{children}</Col>
  </Form.Group>
);
