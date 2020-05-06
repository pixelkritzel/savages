import React from 'react';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormGroupProps } from 'react-bootstrap/FormGroup';
import Row from 'react-bootstrap/Row';

export const SWFormGroup: React.FC<FormGroupProps & { label: string | JSX.Element }> = ({
  children,
  controlId,
  label,
}) => (
  <Form.Group as={Row} controlId={controlId}>
    <Form.Label column sm={6}>
      {label}
    </Form.Label>
    <Col sm={6}>{children}</Col>
  </Form.Group>
);
