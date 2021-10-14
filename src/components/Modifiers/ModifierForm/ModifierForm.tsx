import { observer } from 'mobx-react';

import { Flex, Grid, Span } from 'ui/Grid';

import { Button } from 'ui/Button';

import { Imodifier } from 'store/modifiers';

import { ModifierFormContent } from './ModfierFormContent';

interface ModifierFormProps {
  title: string;
  modifier: Imodifier;
  saveModifier: () => void;
  cancel: () => void;
}

export const ModifierForm = observer(function ModifierFormFn({
  modifier,
  title,
  saveModifier,
  cancel,
  ...otherProps
}: ModifierFormProps) {
  return (
    <Grid as="form">
      <Span as="h1">{title}</Span>
      <ModifierFormContent modifier={modifier} />
      <Span as={Flex} horizontal="end">
        <Button variant="danger" size="big" onClick={() => cancel()}>
          Cancel
        </Button>
        <Button
          disabled={!modifier.isValid}
          variant="success"
          size="big"
          onClick={() => saveModifier()}
        >
          Save Modifier
        </Button>
      </Span>
    </Grid>
  );
});
