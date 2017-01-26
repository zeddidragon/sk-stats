module Knight exposing (..)
import BaseTypes exposing (..)
import Types exposing (WeaponEquip, ArmourEquip)
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

defences knight =
  let
    defs = knight.helmet.armour.defences ++ knight.armour.armour.defences
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
  , defenceUvs = []
  , statusUvs = []
  }

p2wSkolver : ArmourEquip
p2wSkolver =
  { armour = Armour.skolver
  , defenceUvs =
    [ {bonus = Normal, strength = Maximum}
    , {bonus = Piercing, strength = Maximum}
    ] 
  , statusUvs =
    [ {bonus = Shock, strength = Maximum}
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
    { weapon = Swords.flourish
    , uvs = [{ bonus = SwordAsi, strength = VeryHigh }]
    }
  , helmet = p2wSkolver
  , armour = p2wSkolver }
