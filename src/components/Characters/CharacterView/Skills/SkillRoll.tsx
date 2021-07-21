import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactModal from 'react-modal';
import { Icharacter } from 'store/characters';
import { Iskill } from 'store/characters/skillModel';
import { RollTrait } from '../RollTrait/RollTrait';

interface SkillRollProps {
  character: Icharacter;
  skill: Iskill;
}

@observer
export class SkillRoll extends React.Component<SkillRollProps> {
  @observable
  isRollModalOpen = this.props.skill.name === 'shooting'; // TODO: just for dvelopment

  constructor(props: SkillRollProps) {
    super(props);
    makeObservable(this);
  }

  @action
  openRollModal = () => {
    const { character, skill } = this.props;

    const traitModifiers = character.getTraitModifiers(skill.settingSkill.id);

    traitModifiers.nonOptionalModifiers.edges.forEach((modifier) =>
      skill.addActiveModifier(modifier)
    );
    traitModifiers.nonOptionalModifiers.hindrances.forEach((modifier) =>
      skill.addActiveModifier(modifier)
    );

    this.isRollModalOpen = true;
  };

  @action
  closeRollModal = () => {
    this.props.skill.clearActiveModifiers();
    this.isRollModalOpen = false;
  };

  render() {
    const { character, skill } = this.props;

    return (
      <>
        <button onClick={this.openRollModal}>{skill.value}</button>
        {this.isRollModalOpen && (
          <ReactModal
            isOpen={this.isRollModalOpen}
            shouldCloseOnEsc={true}
            onRequestClose={this.closeRollModal}
            ariaHideApp={false}
            // parentSelector={() => document.querySelector('body')!}
          >
            <RollTrait character={character} trait={skill} />
          </ReactModal>
        )}
      </>
    );
  }
}
