import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactModal from 'react-modal';
import { Icharacter } from 'store/characters';
import { Iskill } from 'store/characters/skillModel';
import { TraitRoll } from '../TraitRoll/TraitRoll';

interface SkillRollProps {
  character: Icharacter;
  skill: Iskill;
}

@observer
export class SkillRoll extends React.Component<SkillRollProps> {
  @observable
  isRollModalOpen = false; // this.props.skill.name === 'shooting'; // TODO: just for dvelopment

  constructor(props: SkillRollProps) {
    super(props);
    makeObservable(this);
  }

  @action
  openRollModal = () => {
    this.isRollModalOpen = true;
  };

  @action
  closeRollModal = () => {
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
            <TraitRoll character={character} trait={skill} />
          </ReactModal>
        )}
      </>
    );
  }
}
