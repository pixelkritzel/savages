import { observable, computed, action } from 'mobx';
import { BaseModel } from 'lib/state/BaseModel';
import { TraitModel } from './TraitModel';

export class CharacterModel extends BaseModel {
  @observable
  name = '';

  @observable
  race = '';

  @observable
  origin = '';

  @observable
  money = 0;

  @observable
  age = 0;

  @observable
  conviction = true;

  @observable
  wounds: 0 | 1 | 2 | 3 = 0;

  @observable
  fatigue: 0 | 1 | 2 | 3 = 0;

  @observable
  incapcitaded = false;

  @observable
  advances = 0;

  @observable
  spendAttributesPoints = 0;

  @observable
  attributes = {
    agility: new TraitModel({ name: 'agility' }),
    smarts: new TraitModel({ name: 'smarts' }),
    spirit: new TraitModel({ name: 'spirit' }),
    strength: new TraitModel({ name: 'strength' }),
    vigor: new TraitModel({ name: 'vigor' }),
  };

  @observable
  bennies = 3;

  @observable
  size: number = 3;

  @observable
  freeEdges = 0;

  @observable
  pace = 6;

  @observable
  runningDice = new TraitModel({ name: 'runningDice' });

  @observable
  armor = 0;

  @observable
  meleeWeapons = [];

  @observable
  rangedWeapons = [];

  @observable
  log = [];

  @observable
  setting = [];

  @observable
  skills = new Map();

  @computed
  get parry() {
    const fightingSkill = this.skills.get('fighting');
    const parryFromFighting = fightingSkill
      ? Math.round(fightingSkill.dice / 2) + Math.floor(fightingSkill.bonus / 2)
      : 0;
    return parryFromFighting + 2;
  }
  // get remainingAttributePoints() {
  //   return this.setting.creation.attributePoints - self.spendAttributesPoints;
  // },

  @computed
  get toughness() {
    return (
      Math.round(this.attributes.vigor.dice / 2) + Math.floor(this.attributes.vigor.bonus / 2) + 2
    );
  }

  @action
  set = (key: keyof this, value: this[typeof key]) => {
    this[key] = value;
  };
}
