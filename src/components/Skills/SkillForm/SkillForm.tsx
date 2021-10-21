import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components/macro';
import { action } from 'mobx';
import { clone } from 'mobx-state-tree';

import Select, { OptionsType, OptionTypeBase } from 'react-select';

import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { Flex, Grid, Span } from 'ui/Grid';
import { Textarea } from 'ui/Textarea';
import { Button } from 'ui/Button';
import { List } from 'ui/List';

import { IbaseSkill, Ispezialization, specializationModel } from 'store/skills';
import { attributeNames } from 'store/consts';

import { capitalizeFirstLetter } from 'lib/strings';
import { Checkbox } from 'ui/Checkbox';
import { snakeCase } from 'lodash';

const StyledTextareaFormGroup = styled(FormGroup)`
  height: 100%;
`;

const StyledTextarea = styled(Textarea)`
  width: 100%;
  height: 100%;
`;

const NoSkillSpecializations = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.grays[700]};
`;

interface SkillFormProps {
  skill: IbaseSkill;
  saveSkill: () => void;
  discardSkill: () => void;
  title: string;
  isNewSkill?: boolean;
}

export const SkillForm = observer(function SkillFormFn({
  skill,
  saveSkill,
  discardSkill,
  title,
  isNewSkill,
  ...otherProps
}: SkillFormProps) {
  const localStore = useLocalStore<{
    specialization?: Ispezialization;
    specializationClone?: Ispezialization;
    attributeOptions: OptionsType<OptionTypeBase>;
    isChangeIdentifier: boolean;
  }>(() => ({
    get attributeOptions() {
      return attributeNames.map((name) => ({ label: capitalizeFirstLetter(name), value: name }));
    },
    isChangeIdentifier: false,
  }));

  const saveSpecialization = action(() => {
    skill.availableSkillSpezializations.add(localStore.specialization);
    localStore.specialization = undefined;
  });

  const discardSpecialization = action(() => {
    if (localStore.specializationClone) {
      skill.availableSkillSpezializations.delete(localStore.specialization);
      skill.availableSkillSpezializations.add(localStore.specializationClone);
    }
    localStore.specialization = undefined;
  });

  const newSpecialization = action(() => {
    localStore.specialization = specializationModel.create();
  });

  const editSpecialization = action((specialization: Ispezialization) => {
    localStore.specialization = specialization;
    localStore.specializationClone = clone(specialization);
  });

  const deleteSpecialization = action((specialization: Ispezialization) => {
    skill.availableSkillSpezializations.delete(specialization);
  });

  const toggleIsSkillSpecialization = action(
    () => (localStore.isChangeIdentifier = !localStore.isChangeIdentifier)
  );

  return (
    <form>
      <Grid>
        <Span as="h1">{title}</Span>
        <Span start={1} end={7}>
          <Grid>
            <Span>
              <FormGroup
                label="Skill name"
                direction="column"
                input={({ id }) => (
                  <Input
                    id={id}
                    type="text"
                    value={skill.displayName}
                    placeholder="E.g. Common Knowledge"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      skill.set('displayName', event.target.value);
                      if (!localStore.isChangeIdentifier) {
                        skill.set('name', snakeCase(event.target.value));
                      }
                    }}
                  />
                )}
              />
            </Span>
            <Span>
              <FormGroup
                label="Skill Identifier"
                direction="column"
                input={({ id }) => (
                  <Input
                    id={id}
                    type="text"
                    value={skill.name}
                    readOnly={!localStore.isChangeIdentifier}
                    placeholder="E.g. common_knowledge"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      skill.set('name', event.target.value)
                    }
                  />
                )}
              />
              <Checkbox
                label="Change identifier"
                checked={localStore.isChangeIdentifier}
                onChange={toggleIsSkillSpecialization}
              />
            </Span>

            <Span>
              <FormGroup
                label="Associated Attribute"
                direction="column"
                input={({ id }) => (
                  <Select
                    id={id}
                    options={localStore.attributeOptions}
                    value={localStore.attributeOptions.find(
                      ({ value }) => value === skill.associatedAttribute
                    )}
                    onChange={(option) => option && skill.set('associatedAttribute', option.value)}
                  />
                )}
              />
            </Span>
          </Grid>
        </Span>
        <Span start={7} end={13}>
          <StyledTextareaFormGroup
            label="Description"
            direction="column"
            input={({ id }: { id: string }) => (
              <StyledTextarea
                id={id}
                value={skill.description}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  skill.set('description', event.target.value)
                }
              />
            )}
          />
        </Span>
        <Span>
          <Grid>
            <Span as={Flex} horizontal="space-between" vertical="baseline">
              <h3>Skill Specializations</h3>
              <Button size="big" variant="success" onClick={newSpecialization}>
                New Specialization
              </Button>
            </Span>

            {localStore.specialization && (
              <Span>
                <Grid>
                  <Span as="h4">New skill specialization</Span>
                  <Span>
                    <FormGroup
                      label="Specialization name"
                      input={({ id }) => (
                        <Input
                          id={id}
                          placeholder="E.g. cars for driving"
                          value={localStore.specialization!.name}
                          onValueChange={(value) => localStore.specialization!.set('name', value)}
                        />
                      )}
                    />
                  </Span>
                  <Span>
                    <FormGroup
                      label="Description"
                      input={({ id }) => (
                        <Textarea
                          id={id}
                          value={localStore.specialization!.description}
                          onValueChange={(value) =>
                            localStore.specialization!.set('description', value)
                          }
                        />
                      )}
                    />
                  </Span>
                  <Span horizontal="end" as={Flex}>
                    <Button size="big" variant="danger" onClick={discardSpecialization}>
                      Cancel
                    </Button>
                    <Button size="big" variant="success" onClick={saveSpecialization}>
                      Save
                    </Button>
                  </Span>
                </Grid>
              </Span>
            )}

            <Span>
              {skill.availableSkillSpezializations.length === 0 ? (
                <NoSkillSpecializations>No skill specializations yet</NoSkillSpecializations>
              ) : (
                <Grid as={List} spacing="inside">
                  <Span as="h4">Spezializations for {skill.name}</Span>
                  {skill.availableSkillSpezializations.array.map((specialization) => (
                    <Span key={specialization._id} as="li">
                      <Flex horizontal="space-between">
                        <div>{specialization.name}</div>
                        <Flex>
                          <Button onClick={() => editSpecialization(specialization)}>Edit</Button>
                          <Button
                            variant="danger"
                            onClick={() => deleteSpecialization(specialization)}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </Flex>
                    </Span>
                  ))}
                </Grid>
              )}
            </Span>
          </Grid>
        </Span>
        <Span as={Flex} horizontal="end">
          <Button size="big" onClick={discardSkill}>
            Cancel
          </Button>
          <Button size="big" variant="success" onClick={saveSkill}>
            Save
          </Button>
        </Span>
      </Grid>
    </form>
  );
});
