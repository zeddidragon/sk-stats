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

hearts knight =
  5
  + knight.helmet.piece.hearts
  + knight.armour.piece.hearts
  + (List.sum <| List.map UV.toHearts knight.shield.piece.effects)
  + Trinket.hearts knight.trinkets

health knight = 40 * hearts knight

sum = foldr (+) 0
isType x y = x == first y
nonZero x = 0 /= second x
secondTo x y = (x, y)

toDefence uv =
  case uv of
    DefenceUV (dType, strength) -> (dType, UV.toDefence strength)
    _ -> (Normal, 0)

toDefences uvs = List.map toDefence uvs

toResistance uv =
  case uv of
    StatusUV (status, strength) -> (status, UV.toResistance strength)
    _ -> (Fire, 0)

toResistances uvs = List.map toResistance uvs

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
        , toDefences uvs
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
        , toResistances uvs
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

maxDefence = 350

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
  , shield =
    { piece = Shield.recon
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
