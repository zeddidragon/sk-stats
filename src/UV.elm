module UV exposing (..)

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

type UV
  = Hearts Int
  | WeaponUV (Bonus, BonusStrength)
  | StatusUV (Status, BonusStrength)
  | DefenceUV (DamageType, BonusStrength)

