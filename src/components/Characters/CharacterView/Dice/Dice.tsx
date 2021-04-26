import React from 'react';
import { observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';

import { BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';
import { IncDec } from 'ui/IncDec';
import { SWFormGroup } from 'ui/SWFormGroup';

import { capitalizeFirstLetter } from 'lib/strings';

import { Itrait } from 'store/characters/trait';

import CSS from './Dice.module.scss';

@observer
export class Dice extends React.Component<
  {
    isEdit?: boolean;
    trait: Itrait;
  },
  { isEdit: boolean }
> {
  @observable
  isEdit = this.props.isEdit;

  constructor(props: { isEdit?: boolean; trait: Itrait }) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { trait } = this.props;

    return (
      <div className={cx({ [CSS.oneLine]: !this.isEdit })}>
        <div className={CSS.top}>
          <span>{capitalizeFirstLetter(trait.name)}</span>
          {this.isEdit && (
            <Button variant="success" onClick={() => (this.isEdit = false)}>
              Save
            </Button>
          )}
        </div>
        {this.isEdit && (
          <div className={CSS.form}>
            <SWFormGroup className={CSS.formRow} label="Dice">
              <IncDec
                disableDecrement={!trait.isDiceDecrementable}
                disableIncrement={!trait.isDiceIncrementable}
                onDecrement={trait.decrementDice}
                onIncrement={trait.incrementDice}
                value={trait.dice.toString()}
              />
            </SWFormGroup>
            <SWFormGroup label="Bonus">
              <IncDec
                disableDecrement={!trait.isBonusDecrementable}
                disableIncrement={!trait.isBonusIncrementable}
                onDecrement={trait.decrementBonus}
                onIncrement={trait.incrementBonus}
                value={trait.bonus.toString()}
              />
            </SWFormGroup>
          </div>
        )}

        {!this.isEdit && (
          <>
            <div className={CSS.value}>{trait.value}</div>
            <Button variant="link" className="btn-inline-link" onClick={() => (this.isEdit = true)}>
              <BsPencil />
            </Button>
          </>
        )}
      </div>
    );
  }
}
