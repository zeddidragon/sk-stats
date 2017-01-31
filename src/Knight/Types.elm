module Knight.Types exposing (..)

import Knight.UV exposing (..)

type alias Weapon =
  { name: String
  , damageType: DamageType
  , split: Bool
  , status: Status
  , attacks: List((Stage, Float))
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
