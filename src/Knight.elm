module Knight exposing (..)
import BaseTypes exposing (..)
import Types exposing (WeaponEquip, ArmourEquip)
import Armour exposing (uvToDefence, uvToResistance)
import Swords
import Armour
import List exposing (filter, map, foldr)
import Tuple exposing (first, second)

type alias Knight =
  { name: String
  , weapon: WeaponEquip
  , helmet: ArmourEquip
  , armour: ArmourEquip
  }

hearts knight =
  5
  + knight.helmet.piece.hearts
  + knight.armour.piece.hearts

health knight = 40 * hearts knight

sum = foldr (+) 0
isType x y = x == first y
nonZero x = 0 /= second x
secondTo x y = (x, y)

toDefence uv =
  case uv of
    DefenceUV (dType, strength) -> (dType, Armour.uvToDefence strength)
    _ -> (Normal, 0)

toDefences uvs = List.map toDefence uvs

toResistance uv =
  case uv of
    StatusUV (status, strength) -> (status, Armour.uvToResistance strength)
    _ -> (Fire, 0)

toResistances uvs = List.map toResistance uvs

defences knight =
  let
    defs
      =  knight.helmet.piece.defences ++ knight.armour.piece.defences
      ++ (knight.helmet.uvs ++ knight.armour.uvs |> toDefences)
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

resistances knight =
  let
    resistances
      = knight.helmet.piece.resistances ++ knight.armour.piece.resistances
      ++ (knight.helmet.uvs ++ knight.armour.uvs |> toResistances)
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

maxDefence = 350
maxResistance = 16

stockArmour : ArmourEquip
stockArmour =
  { piece = Armour.cobalt
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
    { piece = Swords.leviathan
    , uvs = []
    }
  , helmet = stockArmour
  , armour = stockArmour
  }

opponent : Knight
opponent =
  { name = "The guy she tells you not to worry about"
  , weapon =
    { piece = Swords.acheron
    , uvs = [WeaponUV (ASI, VeryHigh)]
    }
  , helmet = p2wSkolver
  , armour = p2wSkolver }
