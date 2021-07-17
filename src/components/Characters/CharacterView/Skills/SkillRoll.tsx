import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactModal from 'react-modal';
import { Icharacter } from 'store/characters';
import { Iskill } from 'store/characters/skillModel';
import { RollDice } from '../Dice/RollDice';

interface SkillRollProps {
  character: Icharacter;
  skill: Iskill;
}

@observer
export class SkillRoll extends React.Component<SkillRollProps> {
  @observable
  isRollModalOpen = false;

  constructor(props: SkillRollProps) {
    super(props);
    makeObservable(this);
  }

  openRollModal = () => {
    const { character, skill } = this.props;

    const traitModifiers = character.getTraitModifiers(skill.settingSkill.id);
    console.log(JSON.stringify(traitModifiers, undefined, 2));

    traitModifiers.nonOptionalModifiers.edges.forEach((modifier) =>
      skill.addActiveModifier(modifier)
    );
    traitModifiers.nonOptionalModifiers.hindrances.forEach((modifier) =>
      skill.addActiveModifier(modifier)
    );
    console.log(skill.activeModifiers.values.length);

    this.isRollModalOpen = true;
  };

  closeRollModal = () => {
    this.props.skill.clearActiveModifiers();
    this.isRollModalOpen = false;
  };

  render() {
    const { character, skill } = this.props;

    return (
      <>
        <button onClick={this.openRollModal}>{skill.value}</button>
        <ReactModal
          isOpen={this.isRollModalOpen}
          shouldCloseOnEsc={true}
          onRequestClose={this.closeRollModal}
          ariaHideApp={false}
        >
          <RollDice character={character} trait={skill} />
        </ReactModal>
      </>
    );
  }
}
