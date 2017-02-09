module Knight.Types exposing (..)

import Knight.UV exposing (..)

type WeaponType = Sword | Gun | Bomb
type StatusChance = Slight | Fair | Good | Certain
type StatusStrength = Minor | Moderate | Strong | Ultimate
type Stage = Basic | Heavy | Shot | Charge | Special

type alias Weapon =
  { name: String
  , weaponType: WeaponType
  , damageType: DamageType
  , chargeTime: Float
  , split: Maybe DamageType
  , status: Maybe Status
  , attacks: List (Stage, Float)
  , inflictions: List (Stage, StatusChance, StatusStrength)
  , bonuses: List (Bonus, BonusStrength)
  }

type alias Armour =
  { name: String
  , hearts: Int
  , defences: List (DamageType, Float)
  , resistances: List (Status, Float)
  , bonuses: List (Bonus, BonusStrength)
  }

type alias Shield =
  { name: String
  , effects: List UV
  }

type alias Trinket =
  { name: String
  , effects: List UV
  }

statusChance chance =
  case chance of
    Slight -> 15
    Fair -> 30
    Good -> 45
    Certain -> 100

statusStrength strength =
  case strength of
    Minor -> 0
    Moderate -> 2
    Strong -> 4
    Ultimate -> 8

reductionFactor : Float -> Float
reductionFactor strength =
  if strength > 3 then
    (8 - strength) * 2
  else
    13 - strength

duration status strength =
  let
    base =
      case status of
        Deathmark -> 5
        Stun -> 5
        Poison -> 15
        Curse -> 60
        _ -> 10
    factor = reductionFactor strength
  in
    base * (1 - factor / 30)

