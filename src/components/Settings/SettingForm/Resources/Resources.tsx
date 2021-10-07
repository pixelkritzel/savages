import React, { useContext, useMemo } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Grid, Span } from 'ui/Grid';
import { FormGroup } from 'ui/FormGroup';
import { ComboBox } from 'ui/ComboBox';
import { Istore } from 'store';
import { StoreContext } from 'components/StoreContext';
import { generateId } from 'lib/utils/generateId';
import { Isetting } from 'store/settings';
import { Button } from 'ui/Button';
import styled from 'styled-components';
import { capitalizeFirstLetter } from 'lib/strings';

const AvailableRessoucesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.rhythms.outside.vertical}px;
`;

interface ResourcesProps {
  name: string;
  availableSettingResources:
    | Isetting['availableEdges']
    | Isetting['availableHindrances']
    | Isetting['availablePowers']
    | Isetting['availableSkills']
    | Isetting['availableWeapons'];
  resourcesFromStore:
    | Istore['edges']
    | Istore['hindrances']
    | Istore['powers']
    | Istore['skills']
    | Istore['weapons'];
}

export const Resources = observer(function ResourcesFn({
  name,
  availableSettingResources,
  resourcesFromStore,
  ...otherProps
}: ResourcesProps) {
  const store = useContext<Istore>(StoreContext);

  const localStore = useLocalStore(() => ({
    displayInline: new Set<string>(),
    get comboBoxItems() {
      return resourcesFromStore.asArray
        .filter((resource) => !availableSettingResources.has(resource))
        .map(({ _id, name }) => ({ value: _id, display: name }));
    },
  }));

  const labelId = useMemo(() => generateId(), []);

  return (
    <>
      <Span as="h2">{capitalizeFirstLetter(name)}s</Span>
      <Span start={1} end={9}>
        <FormGroup
          labelId={labelId}
          label={`Find ${name}`}
          input={({ id }) => (
            <ComboBox
              id={id}
              labelId={labelId}
              items={localStore.comboBoxItems}
              onValueSelect={(_id) => availableSettingResources.add(store.hindrances.get(_id))}
            />
          )}
        ></FormGroup>
      </Span>
      <Span start={9} end={13} horizontal="end">
        <Button
          onClick={() =>
            resourcesFromStore.asArray.forEach((resource) =>
              availableSettingResources.add(resource)
            )
          }
          size="big"
        >
          Add all {name}s
        </Button>
      </Span>
      <Span>
        <AvailableRessoucesList>
          {availableSettingResources.array.map((resource) => (
            <li key={resource._id}>
              <Grid spacing="inside">
                <Span start={1} end={10}>
                  <Button
                    variant="link"
                    onClick={() =>
                      localStore.displayInline.has(resource._id)
                        ? localStore.displayInline.delete(resource._id)
                        : localStore.displayInline.add(resource._id)
                    }
                  >
                    {localStore.displayInline.has(resource._id) ? '▼' : '▶︎'} {resource.name}
                  </Button>
                </Span>
                <Span start={10} end={13} horizontal="end">
                  <Button onClick={() => availableSettingResources.delete(resource)}>Remove</Button>
                </Span>
                {localStore.displayInline.has(resource._id) && <Span>{resource.description}</Span>}
              </Grid>
            </li>
          ))}
        </AvailableRessoucesList>
      </Span>
    </>
  );
});
