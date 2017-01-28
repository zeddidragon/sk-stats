module Types exposing (..)

import BaseTypes exposing (..)
import Swords exposing (..)
import Armour exposing (..)

type alias WeaponEquip =
  { weapon: Weapon
  , uvs: List(WeaponUv)
  }

type alias ArmourEquip =
  { armour: Armour
  , uvs: List(ArmourUv)
  }

uvMax = 102 / 4

defences =
  { base = 125 / 2
  , class = 142 / 2
  , special = 150 / 2
  , plate = 200 / 2
  , ancient = 300 / 2
  , uvLow = uvMax  * 1 / 4
  , uvMed = uvMax  * 2 / 4
  , uvHigh = uvMax * 3 / 4
  , uvMax = uvMax
  }
