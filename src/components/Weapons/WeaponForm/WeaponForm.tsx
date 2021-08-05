import { useContext } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';
import Select from 'react-select';

import { Box } from 'ui/Box';
import { Button } from 'ui/Button';
import { Checkbox } from 'ui/Checkbox';
import { FormGroup } from 'ui/FormGroup';
import { Input } from 'ui/Input';
import { IncDec } from 'ui/IncDec';

import { StoreContext } from 'components/StoreContext';

import { Istore } from 'store';
import { Iweapon, weaponTypeFields, WEAPON_TYPES } from 'store/weapons';
import { Flex, Grid, Span } from 'ui/Grid';
import { RadioGroup } from 'ui/RadioGroup';
import { capitalizeFirstLetter } from 'lib/strings';
import { Textarea } from 'store/Textarea';
import { DICE_TYPES } from 'store/consts';

interface WeaponFormProps {
  title: string;
  weapon: Iweapon;
  saveWeapon: () => void;
  discardWeapon: () => void;
}

export const WeaponForm = observer(function WeaponFormFn({
  weapon,
  title,
  saveWeapon,
  discardWeapon,
  ...otherProps
}: WeaponFormProps) {
  const store = useContext<Istore>(StoreContext);
  const localStore = useLocalStore(() => ({}));

  return (
    <form>
      <Grid>
        <Span as="h1">{title}</Span>
        <Span
          as={FormGroup}
          label="Name"
          input={({ id }: { id: string }) => (
            <Input
              id={id}
              value={weapon.name}
              onValueChange={(value) => weapon.set('name', value)}
            />
          )}
        />
        <Span
          as={FormGroup}
          label="Notes"
          input={({ id }: { id: string }) => (
            <Textarea
              id={id}
              value={weapon.notes}
              onValueChange={(value) => weapon.set('notes', value)}
            />
          )}
        />
        <Span>
          <FormGroup
            label="Weapon type"
            input={({ id }) => (
              <div>
                <Grid spacing="inside">
                  {WEAPON_TYPES.map((weaponType) => [
                    weaponType,
                    capitalizeFirstLetter(weaponType),
                  ]).map(([weaponType, label], index) => (
                    <Span
                      start={index % 2 === 0 ? 1 : 7}
                      end={index % 2 === 0 ? 7 : 13}
                      row={Math.ceil((1 + 1 * index) / 2)}
                      horizontal="start"
                    >
                      <Checkbox
                        id={id}
                        label={label}
                        checked={weapon.weaponType[weaponType as keyof typeof weaponTypeFields]}
                        onChange={() =>
                          weapon.weaponType.set(
                            weaponType as keyof typeof weaponTypeFields,
                            !weapon.weaponType[weaponType as keyof typeof weaponTypeFields]
                          )
                        }
                      />
                    </Span>
                  ))}
                </Grid>
              </div>
            )}
          />
        </Span>

        <Span as="h3">Weapon Damage</Span>

        {DICE_TYPES.map((diceSides) => (
          <Span key={diceSides}>
            <FormGroup
              label={
                <Flex horizontal="space-between">
                  {diceSides === 4 ? <strong>Dices</strong> : <div />} <div>D{diceSides}</div>
                </Flex>
              }
              input={() => (
                <IncDec
                  value={weapon.damage.dices[diceSides]}
                  onIncrement={() =>
                    weapon.damage.dices.set(diceSides, weapon.damage.dices[diceSides] + 1)
                  }
                  onDecrement={() =>
                    weapon.damage.dices.set(diceSides, weapon.damage.dices[diceSides] - 1)
                  }
                  disableDecrement={weapon.damage.dices[diceSides] === 0}
                />
              )}
            />
          </Span>
        ))}

        <Span>
          <FormGroup
            label="Bonus"
            input={() => (
              <IncDec
                value={weapon.damage.bonus}
                onIncrement={() => weapon.damage.set('bonus', weapon.damage.bonus + 1)}
                onDecrement={() => weapon.damage.set('bonus', weapon.damage.bonus - 1)}
              />
            )}
          />
        </Span>
        <Span start={1} end={5} />
        <Span start={5} end={13}>
          <Checkbox
            label="Include strength"
            checked={weapon.damage.strength}
            onChange={() => weapon.damage.set('strength', !weapon.damage.strength)}
          />
        </Span>

        <Span as={Flex} horizontal="end">
          <Button variant="danger" size="big" onClick={() => discardWeapon()}>
            Cancel
          </Button>
          <Button variant="success" size="big" onClick={() => saveWeapon()}>
            Save Weapon
          </Button>
        </Span>
      </Grid>
    </form>
  );
});
