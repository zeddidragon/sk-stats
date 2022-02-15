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
  { id = "prc"
  , name = "Royal Jelly Band"
  , effects = [ DefenceUV (Piercing, High) ]
  }

crystal : Trinket
crystal =
  { id = "ele"
  , name = "Radiant Crystal Pin"
  , effects = [ DefenceUV (Elemental, High) ]
  }

skelly : Trinket
skelly =
  { id = "sha"
  , name = "Dread Skelly Charm"
  , effects = [ DefenceUV (Shadow, High) ]
  }

wetstone : Trinket
wetstone =
  { id = "frz"
  , name = "Soaking Wetstone Pendant"
  , effects = [ StatusUV (Fire, Medium) ]
  }

hearthstone : Trinket
hearthstone =
  { id = "fir"
  , name = "Sizzling Hearthstone Pendant"
  , effects = [ StatusUV (Freeze, Medium) ]
  }

wyrmwood : Trinket
wyrmwood =
  { id = "shk"
  , name = "Wyrmwood Bracelet"
  , effects = [ StatusUV (Shock, Medium) ]
  }

laurel : Trinket
laurel =
  { id = "psn"
  , name = "Pure White Laurel"
  , effects = [ StatusUV (Poison, Medium) ]
  }

amulet : Trinket
amulet =
  { id = "cur"
  , name = "Saintly Silver Amulet"
  , effects = [ StatusUV (Curse, Medium) ]
  }

katnip : Trinket
katnip =
  { id = "nip"
  , name = "Purrfect Katnip Pouch"
  , effects = [ StatusUV (Sleep, Medium) ]
  }

penta : Trinket
penta =
  { id = "hp"
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

autumn : Trinket
autumn =
  { id = "autumn"
  , name = "Gift of Autumn"
  , effects =
    [ Hearts 4
    , StatusUV (Freeze, Low)
    ]
  }

solstice : Trinket
solstice =
  { id = "sol"
  , name = "Grand Solstice Ring"
  , effects =
    [ Hearts 4
    , StatusUV (Fire, Low)
    , StatusUV (Freeze, Low)
    ]
  }

somna : Trinket
somna =
  { id = "somna"
  , name = "Somnabulist's Totem"
  , effects =
    [ Hearts 4
    , StatusUV (Sleep, Low)
    , WeaponUV (MSI, Low)
    ]
  }

daybreaker : Trinket
daybreaker =
  { id = "dayb"
  , name = "Daybreaker Band"
  , effects =
    [ Hearts 1
    , StatusUV (Sleep, Low)
    , WeaponUV (CTR, Low)
    , WeaponUV (Slime, Low)
    ]
  }

note : Trinket
note =
  { id = "note"
  , name = "Misplaced Promissory Note"
  , effects =
    [ DefenceUV (Normal, High) ]
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
  , note
  , autumn
  , solstice
  , daybreaker
  , somna
  ]

