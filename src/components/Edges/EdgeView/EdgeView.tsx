import React, { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from 'components/StoreContext';
import { useParams } from 'react-router-dom';
import { Istore } from 'store';
import { Iedge } from 'store/edges';
import { Grid, Span } from 'ui/Grid';
import { Html } from 'ui/Html';
import marked from 'marked';
import { sanitize } from 'dompurify';

interface EdgeViewProps {}

export const EdgeView = observer(function EdgeViewFn({ ...otherProps }: EdgeViewProps) {
  const store = useContext<Istore>(StoreContext);
  const { edgeId } = useParams<{ edgeId: string }>();
  const edge = useMemo(() => store.edges.get(edgeId) as Iedge, [edgeId, store.edges]);
  return (
    <Grid spacing="inside">
      <Span as="h1">{edge.name}</Span>
      <Span>
        <strong>Requirements:</strong> <em>{edge.formattedRequirements}</em>
      </Span>
      <Span>
        <strong>Summary:</strong> <em>{edge.summary}</em>
      </Span>
      <Span>
        <Html html={sanitize(marked(edge.description))} />
      </Span>
    </Grid>
  );
});
