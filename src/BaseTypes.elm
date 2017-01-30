module BaseTypes exposing (..)

type Uv
  = WeaponUv (Bonus, BonusStrength)
  | StatusUv (Status, BonusStrength)
  | DefenceUv (DamageType, BonusStrength)

type DamageType = Normal | Piercing | Elemental | Shadow

type Stage = Basic | Heavy | Charge | Special

type Status = None | Fire | Freeze | Shock | Poison | Stun | Curse | Random

type Bonus
  = Msi

  | Dmg
  | CTR
  | ASI

  | SwordDmg
  | SwordCTR
  | SwordASI

  | GunDmg
  | GunASI
  | GunCTR

  | BombDmg
  | BombCTR

  | Beast
  | Fiend
  | Gremlin
  | Slime
  | Construct
  | Undead

type BonusStrength = Low | Medium | High | VeryHigh | Ultra | Maximum | NegLow

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
  , defences: List((DamageType, Float))
  , resistances: List((Status, Float))
  , bonuses: List((Bonus, BonusStrength))
  }

