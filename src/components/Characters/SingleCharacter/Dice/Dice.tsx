import React from 'react';
import { observable } from 'mobx';

import { observer } from 'mobx-react';

import { BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';

import { IncDec } from 'ui/IncDec';

import { Itrait } from 'store/characters/trait';

import CSS from './Dice.module.scss';
import { SWFormGroup } from 'ui/SWFormGroup';
import { capitalizeFirstLetter } from 'lib/strings';

@observer
export class Dice extends React.Component<
  {
    isEdit: boolean;
    trait: Itrait;
  },
  { isEdit: boolean }
> {
  @observable
  isEdit = this.props.isEdit;

  constructor(props: any) {
    super(props);
    console.log(props);
  }
  render() {
    const { trait } = this.props;

    return (
      <div className={CSS.dice}>
        <div className={CSS.name}>
          <span>{capitalizeFirstLetter(trait.name)}</span>
          {this.isEdit && (
            <>
              <Button variant="success" onClick={() => (this.isEdit = false)}>
                Save
              </Button>
              <div className={CSS.form}>
                <SWFormGroup className={CSS.formRow} label="Dice">
                  <IncDec
                    disableDecrement={!trait.isDiceDecrementable}
                    disableIncrement={!trait.isDiceIncrementable}
                    onDecrement={trait.decrementDice}
                    onIncrement={trait.incrementDice}
                    value={trait.dice}
                  />
                </SWFormGroup>
                <SWFormGroup label="Bonus">
                  <IncDec
                    disableDecrement={!trait.isBonusDecrementable}
                    disableIncrement={!trait.isBonusIncrementable}
                    onDecrement={trait.decrementBonus}
                    onIncrement={trait.incrementBonus}
                    value={trait.dice}
                  />
                </SWFormGroup>
              </div>
            </>
          )}
        </div>
        {!this.isEdit && (
          <>
            <div className={CSS.value}>{trait.value}</div>
            <Button className="btn-inline-link" onClick={() => (this.isEdit = true)}>
              <BsPencil />
            </Button>
          </>
        )}
      </div>
    );
  }
}
