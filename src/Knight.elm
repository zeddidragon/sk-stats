module Knight exposing (..)

import List exposing (filter, map, foldr)
import Tuple exposing (first, second)
import Util exposing (find)

import Knight.Types exposing (..)
import Knight.UV as UV exposing (..)
import Knight.Status exposing (..)
import Knight.Swords as Swords
import Knight.Guns as Guns
import Knight.Bombs as Bombs
import Knight.Armour as Armour
import Knight.Shield as Shield
import Knight.Trinket as Trinket

weapons = Swords.swords ++ Guns.guns ++ Bombs.bombs

type alias Knight =
  { name: String
  , weapons: List WeaponEquip
  , helmet: ArmourEquip
  , armour: ArmourEquip
  , shield: ShieldEquip
  , trinkets: List Trinket
  , vita: Int
  }

type alias WeaponEquip =
  { piece: Weapon
  , uvs: List(UV)
  }

type alias ArmourEquip =
  { piece: Armour
  , uvs: List(UV)
  }

type alias ShieldEquip =
  { piece: Shield
  , uvs: List(UV)
  }

hearts : Knight -> Int
hearts knight =
  5
  + knight.vita
  + knight.helmet.piece.hearts
  + knight.armour.piece.hearts
  + (List.sum <| List.map UV.toHearts knight.shield.piece.effects)
  + Trinket.hearts knight.trinkets

health : Knight -> Int
health knight = 40 * hearts knight

sum = foldr (+) 0
isType x y = x == first y
nonZero x = 0 /= second x
secondTo x y = (x, y)

mobility : Knight -> Int
mobility knight =
  let
    toBonus uv =
      case uv of
        WeaponUV (bonus, strength) -> (bonus, strength)
        _ -> (Dmg, Low)
    uvs =
      []
      ++ knight.shield.piece.effects
      ++ Trinket.effects knight.trinkets
    bonuses =
      List.concat
        [ knight.helmet.piece.bonuses
        , knight.armour.piece.bonuses
        , List.map toBonus knight.shield.piece.effects
        , List.map toBonus uvs
        ]
    boost =
      bonuses
        |> List.filter (\(bonus, strength)-> bonus == MSI)
        |> List.map Tuple.second
        |> List.map UV.toDamageBonus
        |> sum
  in
    100 + boost

attackSpeed : Knight -> WeaponEquip -> Int
attackSpeed knight weapon =
  let
    toBonus uv =
      case uv of
        WeaponUV (bonus, strength) -> (bonus, strength)
        _ -> (Dmg, Low)
    bonusType =
      case weapon.piece.weaponType of
        Sword -> SwordASI
        Gun -> GunASI
        Bomb -> ASI
    uvs =
      []
      ++ knight.shield.piece.effects
      ++ weapon.uvs
      ++ Trinket.effects knight.trinkets
    bonuses =
      List.concat
        [ knight.helmet.piece.bonuses
        , knight.armour.piece.bonuses
        , List.map toBonus uvs
        ]
    boost =
      bonuses
        |> List.filter (\(bonus, strength)-> bonus == ASI || bonus == bonusType)
        |> List.map Tuple.second
        |> List.map UV.toDamageBonus
        |> sum
        |> Basics.min 24
  in
    100 + boost

chargeSpeed : Knight -> WeaponEquip -> Float
chargeSpeed knight weapon =
  let
    toBonus uv =
      case uv of
        WeaponUV (bonus, strength) -> (bonus, strength)
        _ -> (Dmg, Low)
    bonusType =
      case weapon.piece.weaponType of
        Sword -> SwordCTR
        Gun -> GunCTR
        Bomb -> BombCTR
    uvs =
      []
      ++ knight.shield.piece.effects
      ++ weapon.uvs
      ++ Trinket.effects knight.trinkets
    bonuses =
      (CTR, Medium) :: List.concat
        [ knight.helmet.piece.bonuses
        , knight.armour.piece.bonuses
        , List.map toBonus uvs
        ]
    boost =
      bonuses
        |> List.filter (\(bonus, strength)-> bonus == CTR || bonus == bonusType)
        |> List.map Tuple.second
        |> List.map UV.toBonus
        |> sum
        |> Basics.min 6
  in
    weapon.piece.chargeTime * (1 - (toFloat boost) * 0.075)

toDefence : UV -> (DamageType, Float)
toDefence uv =
  case uv of
    DefenceUV (dType, strength) -> (dType, UV.toDefence strength)
    _ -> (Normal, 0)

defences : Bool -> Knight -> List (DamageType, Float)
defences lockdown knight =
  let
    uvs =
      List.concat
        [ knight.helmet.uvs
        , knight.armour.uvs
        , Trinket.effects knight.trinkets
        ]
    defs =
      List.concat
        [ knight.helmet.piece.defences
        , knight.armour.piece.defences
        , List.map toDefence uvs
        ]
    total dtype
      = defs
      |> filter (isType dtype)
      |> map second
      |> sum
      |> secondTo dtype
    applyLockdown (dType, num) =
      (dType, Basics.max (if lockdown then 100 else 0) num)
  in
    [Normal, Piercing, Elemental, Shadow]
      |> map total
      |> map applyLockdown
      |> filter nonZero

defence : Bool -> Knight -> DamageType -> Float
defence lockdown knight dType =
  knight
    |> defences lockdown
    |> find (\(d, amount)-> d == dType)
    |> Maybe.withDefault (dType, 0)
    |> Tuple.second

toResistance : UV -> (Status, Float)
toResistance uv =
  case uv of
    StatusUV (status, strength) -> (status, UV.toResistance strength)
    _ -> (Fire, 0)

resistances : Knight -> List (Status, Float)
resistances knight =
  let
    uvs =
      List.concat
        [ knight.helmet.uvs
        , knight.armour.uvs
        , knight.shield.piece.effects
        , Trinket.effects knight.trinkets
        ]
    resistances =
      List.concat
        [ knight.helmet.piece.resistances
        , knight.armour.piece.resistances
        , List.map toResistance uvs
        ]
    total status
      = resistances
      |> filter (isType status)
      |> map second
      |> sum
      |> Basics.min 10
      |> Basics.max -8
      |> secondTo status
  in
    [Fire, Freeze, Shock, Poison, Stun, Curse, Sleep]
      |> map total
      |> filter nonZero

resistance : Knight -> Status -> Float
resistance knight status =
  knight
    |> resistances
    |> find (\(s, amount)-> s == status)
    |> Maybe.withDefault (status, 0)
    |> Tuple.second

toDamageBoost : UV -> (Bonus, Int)
toDamageBoost uv =
  case uv of
    WeaponUV (bonus, strength) -> (bonus, UV.toDamageBonus strength)
    _ -> (Dmg, 0)

attacks : Knight -> WeaponEquip -> List ((Stage, Float), Maybe (StatusChance, StatusStrength))
attacks knight weapon =
  let
    piece = weapon.piece
    uvs =
      List.map toDamageBoost <| List.concat
        [ knight.shield.piece.effects
        , Trinket.effects knight.trinkets
        ]
    bonuses =
      List.map toIntBoost <| List.concat
        [ knight.helmet.piece.bonuses
        , knight.armour.piece.bonuses
        ]
    toIntBoost (bonus, strength) = (bonus, UV.toDamageBonus strength)
    total bonus
      = uvs ++ bonuses
      |> filter (\(b, strength) -> b == bonus || b == Dmg)
      |> map second
      |> sum
      |> Basics.min 24
    bonusType =
      case piece.weaponType of
        Sword -> SwordDmg
        Gun -> GunDmg
        Bomb -> BombDmg
    boosted damage =
      damage * toFloat(100 + total bonusType) / 100
    boost (attack, damage) =
      let
        isStage stage (s, chance, strength) = stage == s
        toStatusValues infliction =
          case infliction of
            Just (stage, chance, strength) ->
              Just (chance, strength)
            _ -> Nothing
        infliction = piece.inflictions
          |> List.filter (isStage attack)
          |> List.head
          |> toStatusValues
      in
        ((attack, boosted damage), infliction)
  in
    List.map boost piece.attacks

stockArmour : ArmourEquip
stockArmour =
  { piece = Armour.cobalt
  , uvs = []
  }

p2wKat : ArmourEquip
p2wKat =
  { piece = Armour.kat
  , uvs =
    [ DefenceUV (Normal, Maximum)
    , StatusUV (Shock, Maximum)
    , StatusUV (Stun, Maximum)
    ]
  }

you : Knight
you =
  { name = "You"
  , weapons =
    [ { piece = Swords.leviathan
      , uvs = []
      }
    , { piece = Guns.valiance
      , uvs = []
      }
    ]
  , shield =
    { piece = Shield.recon
    , uvs = []
    }
  , helmet = stockArmour
  , armour = stockArmour
  , trinkets = []
  , vita = 0
  }

opponent : Knight
opponent =
  { name = "Challenger"
  , weapons =
    [ { piece = Swords.combuster
      , uvs =
        [ WeaponUV (ASI, VeryHigh)
        , WeaponUV (CTR, VeryHigh)
        ]
      }
    , { piece = Guns.polaris
      , uvs = [ WeaponUV (ASI, VeryHigh) ]
      }
    , { piece = Swords.faust
      , uvs = [ WeaponUV (ASI, VeryHigh) ]
      }
    , { piece = Guns.arcana
      , uvs = [ WeaponUV (ASI, VeryHigh) ]
      }
    ]
  , shield =
    { piece = Shield.striker
    , uvs = []
    }
  , helmet = p2wKat
  , armour = p2wKat
  , trinkets = List.repeat 2 Trinket.penta
  , vita = 16
  }
