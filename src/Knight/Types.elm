module Knight.Types exposing (..)

import Knight.UV exposing (..)

type WeaponType = Sword | Gun | Bomb
type StatusChance = Slight | Fair | Good
type StatusStrength = Minor | Moderate | Strong

type alias Weapon =
  { name: String
  , weaponType: WeaponType
  , damageType: DamageType
  , split: Bool
  , status: Maybe Status
  , attacks: List (Stage, Float)
  , inflictions: List (Stage, StatusChance, StatusStrength)
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
