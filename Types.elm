module App.Types exposing (..)

import BaseTypes exposing (..)
import Swords exposing (..)
import Armour exposing (..)

type alias Model =
  { weapon: WeaponEquip
  , helmet: ArmourEquip
  , armor: ArmourEquip
  }

type alias WeaponEquip =
  { weapon: Weapon
  , uvs: List(WeaponUv)
  }

type alias ArmourEquip =
  { armour: Armour
  , defenceUvs: List(DefenceUv)
  , statusUvs: List(StatusUv)
  }

defences =
  { base = 125 / 2
  , class = 142 / 2
  , special = 150 / 2
  , plate = 200 / 2
  , ancient = 300 / 2
  , uvLow = defences.uvMax  * 1 / 4
  , uvMed = defences.uvMax  * 2 / 4
  , uvHigh = defences.uvMax * 3 / 4
  , uvMax = 102 / 4
  }
