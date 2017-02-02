module Knight exposing (..)

import List exposing (filter, map, foldr)
import Tuple exposing (first, second)

import Knight.Types exposing (..)
import Knight.UV as UV exposing (..)
import Knight.Swords as Swords
import Knight.Armour as Armour
import Knight.Shield as Shield
import Knight.Trinket as Trinket

type alias Knight =
  { name: String
  , weapon: WeaponEquip
  , helmet: ArmourEquip
  , armour: ArmourEquip
  , shield: ShieldEquip
  , trinkets: List Trinket
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

toDefence : UV -> (DamageType, Float)
toDefence uv =
  case uv of
    DefenceUV (dType, strength) -> (dType, UV.toDefence strength)
    _ -> (Normal, 0)

defences : Knight -> List (DamageType, Float)
defences knight =
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
  in
    [Normal, Piercing, Elemental, Shadow]
      |> map total
      |> filter nonZero

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
      |> secondTo status
  in
    [Fire, Freeze, Shock, Poison, Stun, Curse]
      |> map total
      |> filter nonZero

toDamageBoost : UV -> (Bonus, Int)
toDamageBoost uv =
  case uv of
    WeaponUV (bonus, strength) -> (bonus, UV.toDamageBonus strength)
    _ -> (Dmg, 0)

attacks : Knight -> List ((Stage, Float), Maybe (Int, Int))
attacks knight =
  let
    weapon = knight.weapon.piece
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
      case weapon.weaponType of
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
              Just (statusChance chance, statusStrength strength)
            _ -> Nothing
        infliction = weapon.inflictions
          |> List.filter (isStage attack)
          |> List.head
          |> toStatusValues
      in
        ((attack, boosted damage), infliction)
  in
    List.map boost weapon.attacks

stockArmour : ArmourEquip
stockArmour =
  { piece = Armour.ironmight
  , uvs = []
  }

p2wSkolver : ArmourEquip
p2wSkolver =
  { piece = Armour.skolver
  , uvs =
    [ DefenceUV (Normal, Maximum)
    , DefenceUV (Piercing, Maximum)
    , StatusUV (Shock, Maximum)
    ]
  }

you : Knight
you =
  { name = "You"
  , weapon =
    { piece = Swords.triglav
    , uvs = []
    }
  , shield =
    { piece = Shield.guardian
    , uvs = []
    }
  , helmet = stockArmour
  , armour = stockArmour
  , trinkets = []
  }

opponent : Knight
opponent =
  { name = "The guy she tells you not to worry about"
  , weapon =
    { piece = Swords.acheron
    , uvs = [WeaponUV (ASI, VeryHigh)]
    }
  , shield =
    { piece = Shield.striker
    , uvs = []
    }
  , helmet = p2wSkolver
  , armour = p2wSkolver
  , trinkets = List.repeat 2 Trinket.penta
  }
