import React, { useContext } from 'react';

import { observer, useLocalStore } from 'mobx-react';
import { Flex, Grid, Span } from 'ui/Grid';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';

import { Iedge, IedgeRequirement, RANKS } from 'store/edges';
import { FormGroup } from 'ui/FormGroup';
import { Html } from 'ui/Html';

import { Input } from 'ui/Input';
import { Textarea } from 'ui/Textarea';
import { Imodifier } from 'store/modifiers';
import { EditModifier } from './EditModifier';
import { Button } from 'ui/Button';
import ReactModal from 'react-modal';
import { ModifierForm } from 'components/Modifiers/ModifierForm';
import { action } from 'mobx';
import { Select } from 'ui/Select';
import { capitalizeFirstLetter } from 'lib/strings';
import { attributeNames, DICE_TYPES } from 'store/consts';
import { IskillsCollection } from 'store/skills';
import { useMemo } from 'react';

interface EdgeFormProps {
  title: string;
  edge: Iedge;
  saveEdge: () => void;
  discardEdge: () => void;
}

const requirementsScaffold = {
  attribute: {
    name: attributeNames[0] as typeof attributeNames[number],
    value: DICE_TYPES[0] as typeof DICE_TYPES[number],
  },
  skill: {
    skillId: undefined as undefined | IskillsCollection['allSkillIds'][number],
    value: DICE_TYPES[0] as typeof DICE_TYPES[number],
  },
  edgeId: undefined as undefined | Iedge['_id'],
};

export const EdgeForm = observer(function EdgeFormFn({
  edge,
  title,
  saveEdge,
  discardEdge,
  ...otherProps
}: EdgeFormProps) {
  const store = useContext<Istore>(StoreContext);

  const localStore = useLocalStore<{
    editModifier?: 'edit' | 'new';
    requirementScaffolds: typeof requirementsScaffold;
  }>(() => ({
    requirementScaffolds: { ...requirementsScaffold },
  }));

  const skillOptions = useMemo(
    () => [
      { label: 'Choose skill', value: '' },
      ...store.skills.asArray.map(({ displayName, _id }) => ({ label: displayName, value: _id })),
    ],
    [store]
  );

  const edgeOptions = useMemo(
    () => [
      { label: 'Choose edge', value: '' },
      ...store.edges.asArray
        .filter(({ _id }) => edge._id !== _id)
        .map(({ name, _id }) => ({ label: name, value: _id })),
    ],
    [store, edge]
  );

  const newModifier = action(() => {
    store.modifiers.new();
    localStore.editModifier = 'new';
  });

  const saveModifier = action(async () => {
    if (localStore.editModifier === 'new') {
      localStore.editModifier = undefined;
      const modifier = await store.modifiers.saveNewModel();
      edge.modifiers.add(modifier);
    }
  });

  const discardModifier = action(() => {
    if (localStore.editModifier === 'new') {
      store.modifiers.discardNewModel();
    }
    localStore.editModifier = undefined;
  });

  return (
    <Grid as="form">
      <Span as="h1">Edge Form</Span>
      <Span start={1} end={7}>
        <Flex vertical="stretch">
          <FormGroup
            direction="column"
            label="Name"
            input={({ id }) => (
              <Input id={id} value={edge.name} onValueChange={(name) => edge.set('name', name)} />
            )}
          />
          <FormGroup
            direction="column"
            label="Summary"
            input={({ id }) => (
              <Textarea
                id={id}
                value={edge.summary}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  edge.set('summary', event.target.value)
                }
              />
            )}
          />
        </Flex>
      </Span>
      <Span start={7} end={13} vertical="stretch">
        <FormGroup
          direction="column"
          label="Description"
          input={({ id }) => (
            <Textarea
              id={id}
              value={edge.description}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                edge.set('description', event.target.value)
              }
              style={{ height: '100%' }}
            />
          )}
        />
      </Span>
      <Span as="hr" />
      <Span as="h2">Modifiers</Span>
      <Span>
        <Grid spacing="inside">
          {edge.modifiers.length === 0 ? (
            <Span>This edge doesn't have any modifiers</Span>
          ) : (
            edge.modifiers.array.map((modifier: Imodifier) => (
              <Span as={Flex} key={modifier._id} horizontal="space-between" spacing="inside">
                <div>{modifier.name}</div>
                <div>
                  <Flex spacing="inside">
                    <EditModifier modifier={modifier} />
                    <Button onClick={() => edge.modifiers.delete(modifier._id)}>Remove</Button>
                  </Flex>
                </div>
              </Span>
            ))
          )}
        </Grid>
      </Span>
      <Span as={Flex} horizontal="space-between">
        <select
          disabled={!store.modifiers.asArray.length}
          value=""
          onChange={(event) => edge.modifiers.add(store.modifiers.get(event?.target.value))}
        >
          <option>Add an existing modifier</option>
          {store.modifiers.asArray
            .filter((modifier) => !edge.modifiers.array.includes(modifier))
            .map((modifier) => (
              <option key={modifier._id} value={modifier._id}>
                {modifier.name}
              </option>
            ))}
        </select>

        <Button variant="success" onClick={newModifier}>
          New modifier
        </Button>
        {!!localStore.editModifier && (
          <ReactModal isOpen={Boolean(localStore.editModifier)} ariaHideApp={false}>
            <ModifierForm
              title={'New modifier'}
              modifier={store.modifiers.newModel!}
              saveModifier={saveModifier}
              cancel={discardModifier}
            />
          </ReactModal>
        )}
      </Span>
      <Span as="hr" />
      <Span as="h2">Requirements</Span>
      <Span>
        <FormGroup
          label="Rank"
          input={({ id }) => (
            <Select
              id={id}
              value={edge.requirements.rank}
              options={RANKS.map((rank) => ({ label: capitalizeFirstLetter(rank), value: rank }))}
              onValueChange={(rank) => edge.requirements.set('rank', rank as typeof RANKS[number])}
            />
          )}
        />
      </Span>
      <Span start={1} end={5}>
        <Flex direction="column">
          <h3>Attributes</h3>
          <Flex direction="column" spacing="inside">
            {edge.requirements.attributes.length > 0
              ? edge.requirements.attributes.array.map(
                  (
                    attributeRequirement: IedgeRequirement['attributes']['array'][number],
                    index
                  ) => (
                    <Flex
                      key={`${attributeRequirement.name}-${index}`}
                      horizontal="space-between"
                      spacing="inside"
                    >
                      <div>{`${capitalizeFirstLetter(attributeRequirement.name)} D${
                        attributeRequirement.value
                      }`}</div>
                      <Button
                        variant="icon"
                        onClick={() => edge.requirements.attributes.delete(attributeRequirement)}
                      >
                        <Html as="span" html="&times;" />
                      </Button>
                    </Flex>
                  )
                )
              : 'No requirements'}
          </Flex>
          <hr />
          <FormGroup
            direction="column"
            label="Attribute type"
            input={({ id }) => (
              <Select
                id={id}
                value={localStore.requirementScaffolds.attribute.name}
                options={attributeNames.map((name) => ({
                  label: capitalizeFirstLetter(name),
                  value: name,
                }))}
                onValueChange={action(
                  (attributeName) =>
                    (localStore.requirementScaffolds.attribute.name = attributeName)
                )}
              />
            )}
          />
          <FormGroup
            direction="column"
            label={`Dice ${localStore.requirementScaffolds.attribute.value}`}
            input={({ id }) => (
              <Input
                type="range"
                id={id}
                value={localStore.requirementScaffolds.attribute.value}
                step={2}
                min={DICE_TYPES[0]}
                max={DICE_TYPES[DICE_TYPES.length - 1]}
                onValueChange={action(
                  (diceValue) =>
                    (localStore.requirementScaffolds.attribute.value = Number(
                      diceValue
                    ) as typeof DICE_TYPES[number])
                )}
              />
            )}
          />
          <Button
            variant="success"
            size="big"
            onClick={() => {
              edge.requirements.attributes.add({ ...localStore.requirementScaffolds.attribute });
            }}
          >
            Add requirement
          </Button>
        </Flex>
      </Span>
      <Span start={5} end={9}>
        <Flex direction="column">
          <h3>Skills</h3>
          <Flex direction="column" spacing="inside">
            {edge.requirements.skills.length > 0
              ? (edge.requirements.skills.array as IedgeRequirement['skills']['array']).map(
                  (skillRequirement, index) => (
                    <Flex
                      key={`${store.skills.get(skillRequirement.skillId)}`}
                      horizontal="space-between"
                      spacing="inside"
                    >
                      <div>{`${capitalizeFirstLetter(
                        store.skills.get(skillRequirement.skillId).displayName
                      )} D${skillRequirement.value}`}</div>
                      <Button
                        variant="icon"
                        onClick={() => edge.requirements.skills.delete(skillRequirement)}
                      >
                        <Html as="span" html="&times;" />
                      </Button>
                    </Flex>
                  )
                )
              : 'No requirements'}
          </Flex>
          <hr />
          <FormGroup
            direction="column"
            label="Edge"
            input={({ id }) => (
              <Select
                id={id}
                value={localStore.requirementScaffolds.skill.skillId}
                options={skillOptions}
                onValueChange={action(
                  (skillId) => (localStore.requirementScaffolds.skill.skillId = skillId)
                )}
              />
            )}
          />
          <FormGroup
            direction="column"
            label={`Dice ${localStore.requirementScaffolds.skill.value}`}
            input={({ id }) => (
              <Input
                type="range"
                id={id}
                value={localStore.requirementScaffolds.skill.value}
                step={2}
                min={DICE_TYPES[0]}
                max={DICE_TYPES[DICE_TYPES.length - 1]}
                onValueChange={action(
                  (diceValue) =>
                    (localStore.requirementScaffolds.skill.value = Number(
                      diceValue
                    ) as typeof DICE_TYPES[number])
                )}
              />
            )}
          />
          <Button
            variant="success"
            size="big"
            onClick={() => {
              edge.requirements.skills.add({ ...localStore.requirementScaffolds.skill });
            }}
          >
            Add requirement
          </Button>
        </Flex>
      </Span>
      <Span start={9} end={13}>
        <Flex direction="column">
          <h3>Edges</h3>
          <Flex direction="column" spacing="inside">
            {edge.requirements.edgesIds.length > 0
              ? (edge.requirements.edgesIds.array as IedgeRequirement['edgesIds']['array']).map(
                  (edgeId: string, index) => (
                    <Flex key={`${edgeId}`} horizontal="space-between" spacing="inside">
                      <div>{store.edges.get(edgeId).name}</div>
                      <Button
                        variant="icon"
                        onClick={() => edge.requirements.edgesIds.delete(edgeId)}
                      >
                        <Html as="span" html="&times;" />
                      </Button>
                    </Flex>
                  )
                )
              : 'No requirements'}
          </Flex>
          <hr />
          <FormGroup
            direction="column"
            label="Skill type"
            input={({ id }) => (
              <Select
                id={id}
                value={localStore.requirementScaffolds.skill.skillId}
                options={edgeOptions}
                onValueChange={action(
                  (edgeId) => (localStore.requirementScaffolds.edgeId = edgeId)
                )}
              />
            )}
          />
          <Button
            variant="success"
            size="big"
            onClick={() => {
              if (localStore.requirementScaffolds.edgeId) {
                edge.requirements.edgesIds.add(localStore.requirementScaffolds.edgeId);
              }
            }}
          >
            Add Edge
          </Button>
        </Flex>
      </Span>
      <Span as="hr" />
      <Span as={Flex} horizontal="end">
        <Button size="big" onClick={discardEdge}>
          Cancel
        </Button>
        <Button variant="success" size="big" onClick={saveEdge}>
          Save Edge
        </Button>
      </Span>
    </Grid>
  );
});
