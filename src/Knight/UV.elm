module Knight.UV exposing (..)
import Util exposing (lIndex)

type DamageType = Normal | Piercing | Elemental | Shadow

type Stage = Basic | Heavy | Charge | Special

type Status = None | Fire | Freeze | Shock | Poison | Stun | Curse | Random

type Bonus
  = MSI

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

type BonusStrength
  = Low
  | Medium
  | High
  | VeryHigh
  | Ultra
  | Maximum

  | NegLow
  | NegMedium
  | NegHigh
  | NegVeryHigh
  | NegUltra
  | NegMaximum

strengths =
  [ Low
  , Medium
  , High
  , VeryHigh
  , Ultra
  , Maximum
  ]

penalties =
  [ NegLow
  , NegMedium
  , NegHigh
  , NegVeryHigh
  , NegUltra
  , NegMaximum
  ]

type UV
  = Hearts Int
  | WeaponUV (Bonus, BonusStrength)
  | StatusUV (Status, BonusStrength)
  | DefenceUV (DamageType, BonusStrength)

uvMax = 25.6

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

toHearts effect =
  case effect of
    Hearts n -> n
    _ -> 0

toBonus strength =
  let
    bonus = lIndex strength strengths |> Maybe.withDefault 0
    penalty = lIndex strength penalties |> Maybe.withDefault 0
  in
    bonus - penalty

toDefence strength =
  case strength of
    Low -> defences.uvLow
    Medium -> defences.uvMed
    High -> defences.uvHigh
    Maximum -> defences.uvMax
    _ -> 0

toResistance strength =
  case strength of
    Low -> 1
    Medium -> 2
    High -> 3
    Maximum -> 4
    _ -> 0

