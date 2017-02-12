module Knight.Guns exposing (..)

import Knight.Values exposing (charge, attacks)
import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight.Status exposing (..)

gun : Weapon
gun =
  { id = "gun"
  , weaponType = Gun
  , name = "Stock Gun"
  , damageType = Normal
  , split = Nothing
  , status = Nothing
  , chargeTime = charge.normal
  , attacks = []
  , inflictions = []
  , bonuses = []
  }

valiance : Weapon
valiance =
  { gun
  | id = "vali"
  , name = "Valiance"
  , attacks =
    [ (Shot, attacks.blaster)
    , (Charge, attacks.blasterCharge)
    ]
  }

rift : Weapon
rift = 
  { valiance
  | id = "rift"
  , name = "Riftlocker"
  , damageType = Piercing
  }

arcana : Weapon
arcana = 
  { valiance
  | id = "arc"
  , name = "Arcana"
  , damageType = Elemental
  }

phant : Weapon
phant = 
  { valiance
  | id = "phant"
  , name = "Phantomos"
  , damageType = Shadow
  }

nova : Weapon
nova =
  { gun
  | id = "nova"
  , name = "Nova Driver"
  , damageType = Elemental
  , attacks =
    [ (Shot, attacks.nova)
    , (Charge, attacks.novaCharge)
    ]
  }

umbra : Weapon
umbra =
  { nova
  | id = "umbra"
  , name = "Umbra Driver"
  , damageType = Shadow
  }

magma : Weapon
magma =
  { nova
  | id = "magma"
  , name = "Magma Driver"
  , status = Just Fire
  , attacks =
    [ (Shot, attacks.driver)
    , (Charge, attacks.driverCharge)
    ]
  , inflictions =
    [ (Shot, Good, Moderate)
    , (Charge, Good, Moderate)
    ]
  }

cryo : Weapon
cryo =
  { magma
  | id = "cryo"
  , name = "Cryo Driver"
  , status = Just Freeze
  }

storm : Weapon
storm =
  { magma
  | id = "storm"
  , name = "Storm Driver"
  , status = Just Shock
  }

pepper : Weapon
pepper =
  { gun
  | id = "pbox"
  , name = "Volcanic Pepperbox"
  , status = Just Fire
  , attacks =
    [ (Shot, attacks.pepper)
    , (Charge, attacks.pepperCharge)
    ]
  , inflictions =
    [ (Shot, Slight, Moderate)
    , (Charge, Slight, Moderate)
    ]
  }

plague : Weapon
plague =
  { pepper
  | id = "plague"
  , name = "Plague Needle"
  , damageType = Piercing
  , status = Just Poison
  , inflictions =
    [ (Shot, Slight, Strong)
    , (Charge, Slight, Strong)
    ]
  }

blitz : Weapon
blitz =
  { gun
  | id = "blitz"
  , name = "Blitz Needle"
  , damageType = Piercing
  , attacks =
    [ (Shot, attacks.antigua)
    , (Charge, attacks.antiguaCharge)
    ]
  }

grim : Weapon
grim =
  { blitz
  | id = "grim"
  , name = "Grim Repeater"
  , damageType = Shadow
  }

gg : Weapon
gg =
  { blitz
  | id = "gg"
  , name = "Gilded Griffin"
  , bonuses = [ (Beast, High) ]
  }

ap : Weapon
ap =
  { gg
  | id = "ap"
  , name = "Argent Peacemaker"
  , damageType = Elemental
  , bonuses = [ (Undead, High) ]
  }

sent : Weapon
sent =
  { ap
  | id = "sent"
  , name = "Sentenza"
  , damageType = Shadow
  , bonuses = [ (Gremlin, High) ]
  }

obsidian : Weapon
obsidian =
  { grim
  | id = "oc"
  , name = "Obsidian Carbine"
  , status = Just Poison
  , inflictions =
    [ (Shot, Slight, Moderate)
    , (Charge, Fair, Moderate)
    ]
  }

slug : Weapon
slug =
  { gun
  | id = "slug"
  , name = "Iron Slug"
  , status = Just Stun
  , attacks =
    [ (Shot, attacks.magnus)
    , (Charge, attacks.magnusCharge)
    ]
  , inflictions =
    [ (Shot, Fair, Moderate)
    , (Charge, Good, Moderate)
    ]
  }

cal : Weapon
cal =
  { slug
  | id = "cal"
  , name = "Callahan"
  , damageType = Piercing
  }

wg : Weapon
wg =
  { slug
  | id = "wg"
  , name = "Winter Grave"
  , damageType = Shadow
  , status = Just Freeze
  }

supernova : Weapon
supernova =
  { gun
  | id = "super"
  , name = "Supernova"
  , attacks =
    [ (Shot, attacks.driver)
    , (Heavy, attacks.nova)
    , (Charge, attacks.novaCharge)
    ]
  }

polaris : Weapon
polaris =
  { gun
  | id = "pola"
  , name = "Polaris"
  , damageType = Elemental
  , status = Just Shock
  , attacks =
    [ (Shot, attacks.driver)
    , (Heavy, attacks.blaster)
    , (Charge, attacks.blasterCharge)
    ]
  , inflictions =
    [ (Shot, Good, Moderate)
    , (Heavy, Good, Moderate)
    , (Charge, Good, Moderate)
    ]
  }

wildfire : Weapon
wildfire =
  { polaris
  | id = "wf"
  , name = "Wildfire"
  , status = Just Fire
  }

permafroster : Weapon
permafroster =
  { polaris
  | id = "pf"
  , name = "Permafroster"
  , status = Just Freeze
  }

neutralizer : Weapon
neutralizer =
  { gun
  | id = "neutra"
  , name = "Neutralizer"
  , chargeTime = charge.quick
  , attacks =
    [ (Charge, attacks.neutralizer)
    , (Special, attacks.driver)
    ]
  }

biohazard : Weapon
biohazard =
  { neutralizer
  | id = "bio"
  , name = "Biohazard"
  , status = Just Poison
  , attacks =
    [ (Charge, attacks.magnusCharge)
    , (Special, attacks.driver)
    ]
  , inflictions =
    [ (Charge, Good, Moderate)
    , (Special, Fair, Moderate)
    ]
  }

tortofists : List Weapon
tortofists =
  let
    variants =
      [ ("gorgo", "Gorgofist", Shadow)
      , ("grand", "Grand Tortofist", Normal)
      , ("savage", "Savage Tortofist", Piercing)
      , ("omega", "Omega Tortofist", Elemental)
      ]
    copy (id, name, dType) =
      { gun
      | id = id
      , name = name
      , damageType = dType
      , attacks =
        [ (Basic, attacks.tortofist)
        , (Shot, attacks.blaster)
        , (Charge, attacks.antiguaCharge)
        , (Special, attacks.pepperCharge)
        ]
      }
  in
    List.map copy variants

mixmasters : List Weapon
mixmasters =
  let
    variants =
      [ ("mix", "Overcharged Mixmaster", Shock)
      , ("fmix", "Celestial Orbitgun", Fire)
      ]
    copy (id, name, status) =
      { gun
      | id = id
      , name = name
      , damageType = Elemental
      , status = Just status
      , attacks =
        [ (Shot, attacks.driver)
        , (Charge, attacks.driverCharge)
        ]
      , inflictions =
        [ (Shot, Good, Moderate)
        , (Charge, Good, Moderate)
        ]
      }
  in
    List.map copy variants

guns : List Weapon
guns =
  [valiance, rift, arcana, phant]
  ++ [nova, umbra, magma, storm, cryo]
  ++ [blitz, grim, pepper, plague]
  ++ [slug, cal, wg]
  ++ [gg, ap, sent, obsidian]
  ++ [supernova, polaris, wildfire, permafroster]
  ++ [neutralizer, biohazard]
  ++ tortofists
  ++ mixmasters

