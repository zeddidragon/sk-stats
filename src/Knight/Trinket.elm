module Knight.Trinket exposing (..)

import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight.Status exposing (..)

hearts : List Trinket -> Int
hearts trinkets =
  let
    toHearts trinket =
      List.map Knight.UV.toHearts trinket.effects
  in
    trinkets
      |> List.concatMap toHearts
      |> List.sum

effects : List Trinket -> List UV
effects trinkets =
  List.concatMap .effects trinkets

jelly : Trinket
jelly =
  { id = "band"
  , name = "Royal Jelly Band"
  , effects = [ DefenceUV (Piercing, High) ]
  }

crystal : Trinket
crystal =
  { id = "pin"
  , name = "Radiant Crystal Pin"
  , effects = [ DefenceUV (Elemental, High) ]
  }

skelly : Trinket
skelly =
  { id = "charm"
  , name = "Dread Skelly Charm"
  , effects = [ DefenceUV (Shadow, High) ]
  }

wetstone : Trinket
wetstone =
  { id = "wet"
  , name = "Soaking Wetstone Pendant"
  , effects = [ StatusUV (Fire, Medium) ]
  }

hearthstone : Trinket
hearthstone =
  { id = "hearth"
  , name = "Sizzling Hearthstone Pendant"
  , effects = [ StatusUV (Freeze, Medium) ]
  }

wyrmwood : Trinket
wyrmwood =
  { id = "wyrm"
  , name = "Wyrmwood Bracelet"
  , effects = [ StatusUV (Shock, Medium) ]
  }

laurel : Trinket
laurel =
  { id = "white"
  , name = "Pure White Laurel"
  , effects = [ StatusUV (Poison, Medium) ]
  }

amulet : Trinket
amulet =
  { id = "saint"
  , name = "Saintly Silver Amulet"
  , effects = [ StatusUV (Curse, Medium) ]
  }

penta : Trinket
penta =
  { id = "penta"
  , name = "Penta-Heart Pendant"
  , effects = [ Hearts 6 ]
  }

bomb : Trinket
bomb =
  { id = "bctr"
  , name = "Elite Bomb Focus Module"
  , effects = [ WeaponUV (BombCTR, Medium) ]
  }

boom : Trinket
boom =
  { id = "bdmg"
  , name = "Elite Boom Module"
  , effects = [ WeaponUV (BombDmg, Medium) ]
  }

handgun : Trinket
handgun =
  { id = "gctr"
  , name = "Elite Handgun Focus Module"
  , effects = [ WeaponUV (GunCTR, Medium) ]
  }

draw : Trinket
draw =
  { id = "gasi"
  , name = "Elite Quick Draw Module"
  , effects = [ WeaponUV (GunASI, Medium) ]
  }

trueshot : Trinket
trueshot =
  { id = "gdmg"
  , name = "Elite Trueshot Module"
  , effects = [ WeaponUV (GunDmg, Medium) ]
  }

sword : Trinket
sword =
  { id = "sctr"
  , name = "Elite Sword Focus Module"
  , effects = [ WeaponUV (SwordCTR, Medium) ]
  }

strike : Trinket
strike =
  { id = "sasi"
  , name = "Elite Quick Strike Module"
  , effects = [ WeaponUV (SwordASI, Medium) ]
  }

slash : Trinket
slash =
  { id = "sdmg"
  , name = "Elite Slash Module"
  , effects = [ WeaponUV (SwordDmg, Medium) ]
  }

solstice : Trinket
solstice =
  { id = "solstice"
  , name = "Grand Solstice Ring"
  , effects =
    [ Hearts 4
    , StatusUV (Fire, Low)
    , StatusUV (Freeze, Low)
    ]
  }

trinkets =
  [ penta
  , slash
  , strike
  , sword
  , trueshot
  , draw
  , handgun
  , boom
  , bomb
  , wetstone
  , hearthstone
  , wyrmwood
  , laurel
  , jelly
  , crystal
  , skelly
  ]

