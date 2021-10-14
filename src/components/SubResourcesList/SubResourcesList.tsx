import { useMemo } from 'react';
import { action } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import styled from 'styled-components';

import { Button } from 'ui/Button';
import { Flex, Grid, Span } from 'ui/Grid';
import { SlightIn } from 'ui/SlightIn';

import { IboxedArray } from 'lib/state/createBoxedArray';
import { ImodelPrototype, SOmodelPrototype } from 'lib/state';

const EDIT_AREA_ANIMATION_TIMING = 300;

const ResourceBlock = styled(Span)<{ isEdit: boolean }>`
  padding: ${({ theme }) => theme.rhythms.inside.vertical}px
    ${({ theme }) => theme.rhythms.inside.horizontal}px;
  margin: ${({ theme }) => theme.rhythms.inside.vertical}px -${({ theme }) => theme.rhythms.inside.horizontal}px;
  background-color: ${({ isEdit, theme }) =>
    isEdit ? theme.colors.backgrounds.highlight_light : theme.colors.backgrounds.default};
  transition: background-color ${EDIT_AREA_ANIMATION_TIMING}ms;
`;

const EditAreaFooter = styled(Flex)`
  margin-top: ${({ theme }) => theme.rhythms.inside.vertical}px;
`;

interface SubResourcesListProps {
  ressources: IboxedArray;
  emptyText: string;
  onEdit?: (_id?: ImodelPrototype['_id']) => void;
  editLabel?: string;
  onRemove?: (_id: ImodelPrototype['_id']) => void;
  removeLabel?: string;
  editForm: <T extends ImodelPrototype>(resourceModel: T) => JSX.Element;
  onDiscard?: () => void;
  onSave?: () => void;
}

export const SubResourcesList = observer(function SubResourcesListFn({
  ressources,
  emptyText,
  onEdit,
  editLabel = 'Edit',
  removeLabel = 'Remove',
  onRemove,
  onDiscard,
  editForm,
  onSave,
  ...otherProps
}: SubResourcesListProps) {
  const localStore = useLocalStore<{
    currentlyEditedResouce: null | SOmodelPrototype;
    editAreaHeight: 0 | 'auto';
  }>(() => ({
    currentlyEditedResouce: null,
    editAreaHeight: 0,
  }));

  const isEdit = useMemo(() => !!localStore.currentlyEditedResouce, [
    localStore.currentlyEditedResouce,
  ]);

  const edit = useMemo(
    () =>
      action((resource: ImodelPrototype) => {
        localStore.currentlyEditedResouce = getSnapshot(resource);
        localStore.editAreaHeight = 'auto';
        onEdit && onEdit(resource._id);
      }),
    [localStore, onEdit]
  );

  const discard = useMemo(
    () =>
      action((resource: ImodelPrototype) => {
        applySnapshot(resource, localStore.currentlyEditedResouce);
        localStore.currentlyEditedResouce = null;
        localStore.editAreaHeight = 0;
        onDiscard && onDiscard();
      }),
    [localStore, onDiscard]
  );

  const save = useMemo(
    () =>
      action(() => {
        localStore.currentlyEditedResouce = null;
        localStore.editAreaHeight = 0;
        onSave && onSave();
      }),
    [localStore, onSave]
  );

  const remove = useMemo(
    () =>
      action((resource: ImodelPrototype) => {
        ressources.delete(resource);
        onRemove && onRemove(resource._id);
      }),
    [onRemove, ressources]
  );

  return (
    <Grid spacing="inside" {...otherProps} role="list">
      {ressources.length === 0 ? (
        <Span>{emptyText}</Span>
      ) : (
        ressources.array.map((resource: ImodelPrototype) => (
          <ResourceBlock
            isEdit={isEdit}
            key={resource._id}
            role="listitem"
            aria-labelledby={`resource-${resource._id}`}
          >
            <Flex horizontal="space-between" spacing="inside">
              <div id={`resource-${resource._id}`}>{resource.name}</div>
              <div>
                <Flex spacing="inside">
                  <Button
                    aria-expanded={localStore.editAreaHeight !== 0}
                    aria-controls={`resource-edit-area-${resource._id}`}
                    disabled={isEdit}
                    onClick={() => edit(resource)}
                  >
                    {editLabel}
                  </Button>
                  <Button disabled={isEdit} onClick={() => remove(resource)}>
                    {removeLabel}
                  </Button>
                </Flex>
              </div>
            </Flex>
            <SlightIn
              id={`resource-edit-area-${resource._id}`}
              duration={EDIT_AREA_ANIMATION_TIMING}
            >
              {localStore.currentlyEditedResouce?._id === resource._id && (
                <>
                  {editForm(resource)}
                  <EditAreaFooter horizontal="end">
                    <Button onClick={() => discard(resource)}>Discard changes</Button>
                    <Button onClick={save}>Save changes</Button>
                  </EditAreaFooter>
                </>
              )}
            </SlightIn>
          </ResourceBlock>
        ))
      )}
    </Grid>
  );
});
