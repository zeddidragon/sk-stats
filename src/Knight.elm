module Knight exposing (..)
import BaseTypes exposing (..)
import Types exposing (WeaponEquip, ArmourEquip)
import Armour exposing (uvToDefence)
import Swords
import Armour
import List exposing (filter, map, foldr)

type alias Knight =
  { name: String
  , weapon: WeaponEquip
  , helmet: ArmourEquip
  , armour: ArmourEquip
  }

hearts knight =
  5
  + knight.helmet.armour.hearts
  + knight.armour.armour.hearts

health knight = 40 * hearts knight

sum = foldr (+) 0
fst (a, _) = a
snd (_, b) = b
isType x y = x == fst y
nonZero x = 0 /= snd x

toDefence uv =
  case uv of
    DefenceUv (dType, strength) -> (dType, Armour.uvToDefence strength)
    _ -> (Normal, 0)

toDefences : List ArmourUv -> List (DamageType, Float)
toDefences uvs = List.map toDefence uvs

defences knight =
  let
    defs
      =  knight.helmet.armour.defences ++ knight.armour.armour.defences
      ++ (knight.helmet.uvs ++ knight.armour.uvs |> toDefences)
    total dtype = (dtype, sum (map snd (filter (isType dtype) defs)))
  in
    filter nonZero (map total [Normal, Piercing, Elemental, Shadow])

resistances knight =
  let
    resistances = knight.helmet.armour.resistances ++ knight.armour.armour.resistances
    total status = (status, sum (map snd (filter (isType status) resistances)))
  in
    filter nonZero (map total [Fire, Freeze, Shock, Poison, Stun, Curse])

maxDefence = 402
maxResistance = 16

stockArmour : ArmourEquip
stockArmour =
  { armour = Armour.cobalt
  , uvs = []
  }

p2wSkolver : ArmourEquip
p2wSkolver =
  { armour = Armour.skolver
  , uvs =
    [ DefenceUv (Normal, Maximum)
    , DefenceUv (Piercing, Maximum)
    , StatusUv (Shock, Maximum)
    ]
  }

you : Knight
you =
  { name = "You"
  , weapon =
    { weapon = Swords.leviathan
    , uvs = []
    }
  , helmet = stockArmour
  , armour = stockArmour
  }

opponent : Knight
opponent =
  { name = "The guy she tells you not to worry about"
  , weapon =
    { weapon = Swords.acheron
    , uvs = [(SwordAsi, VeryHigh)]
    }
  , helmet = p2wSkolver
  , armour = p2wSkolver }
