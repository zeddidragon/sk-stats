module Msg exposing (..)

import BaseTypes exposing (Weapon, Armour)

type Msg
  = EquipWeapon Weapon
  | EquipHelmet Armour
  | EquipArmour Armour
  
