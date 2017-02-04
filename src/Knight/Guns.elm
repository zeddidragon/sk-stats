module Knight.Guns exposing (..)

import Knight.Values exposing (charge, attacks)
import Knight.Types exposing (..)
import Knight.UV exposing (..)

gun : Weapon
gun =
  { weaponType = Gun
  , name = "Stock Gun"
  , damageType = Normal
  , split = False
  , status = Nothing
  , chargeTime = charge.normal
  , attacks = []
  , inflictions = []
  , bonuses = []
  }

valiance : Weapon
valiance =
  { gun
  | name = "Valiance"
  , attacks =
    [ (Shot, attacks.blaster)
    , (Charge, attacks.blasterCharge)
    ]
  }

blasters : List Weapon
blasters =
  let
    variants =
      [ ("Riftlocker", Piercing)
      , ("Arcana", Elemental)
      , ("Phantomos", Shadow)
      ]
    copy (name, dType) =
      { valiance
      | name = name
      , damageType = dType
      }
  in
    List.map copy variants

nova : Weapon
nova =
  { gun
  | name = "Nova Driver"
  , damageType = Elemental
  , attacks =
    [ (Shot, attacks.nova)
    , (Charge, attacks.novaCharge)
    ]
  }

umbra : Weapon
umbra =
  { nova
  | name = "Umbra Driver"
  , damageType = Shadow
  }

alchemers : List Weapon
alchemers =
  let
    variants =
      [ ("Magma Driver", Fire)
      , ("Hail Driver", Freeze)
      , ("Storm Driver", Shock)
      ]
    copy (name, status) =
      { nova
      | name = name
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

pepper : Weapon
pepper =
  { gun
  | name = "Volcanic Pepperbox"
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
  | name = "Plague Needle"
  , status = Just Poison
  , inflictions =
    [ (Shot, Slight, Strong)
    , (Charge, Slight, Strong)
    ]
  }

autoguns : List Weapon
autoguns =
  let
    variants =
      [ ("Blitz Needle", Piercing)
      , ("Grim Repeater", Shadow)
      ]
    copy (name, dType) =
      { gun
      | name = name
      , damageType = dType
      , attacks =
        [ (Shot, attacks.antigua)
        , (Charge, attacks.antiguaCharge)
        ]
      }
  in
    List.map copy variants

antiguas : List Weapon
antiguas =
  let
    variants =
      [ ("Gilded Griffin", Piercing, Beast)
      , ("Argent Peacemaker", Elemental, Undead)
      , ("Sentenza", Shadow, Gremlin)
      ]
    copy (name, dType, bonus) =
      { gun
      | name = name
      , damageType = dType
      , attacks =
        [ (Shot, attacks.antigua)
        , (Charge, attacks.antiguaCharge)
        ]
      , bonuses = [ (bonus, High) ]
      }
  in
    List.map copy variants

obsidian : Weapon
obsidian =
  { gun
  | name = "Obsidian Carbine"
  , damageType = Shadow
  , status = Just Poison
  , attacks =
    [ (Shot, attacks.antigua)
    , (Charge, attacks.antiguaCharge)
    ]
  , inflictions =
    [ (Shot, Slight, Moderate)
    , (Charge, Fair, Moderate)
    ]
  }

magnuses : List Weapon
magnuses =
  let
    variants =
      [ ("Callahan", Piercing, Stun)
      , ("Iron Slug", Normal, Stun)
      , ("Winter Grave", Shadow, Freeze)
      ]
    copy (name, dType, status) =
      { gun
      | name = name
      , damageType = dType
      , status = Just status
      , attacks =
        [ (Shot, attacks.magnus)
        , (Charge, attacks.magnusCharge)
        ]
      , inflictions =
        [ (Shot, Fair, Moderate)
        , (Charge, Good, Moderate)
        ]
      }
  in
    List.map copy variants

supernova : Weapon
supernova =
  { gun
  | name = "Supernova"
  , attacks =
    [ (Shot, attacks.driver)
    , (Heavy, attacks.magnus)
    , (Charge, attacks.novaCharge)
    ]
  }

pulsars : List Weapon
pulsars =
  let
    variants =
      [ ("Polaris", Shock)
      , ("Wildfire", Fire)
      ]
    copy (name, status) =
      { gun
      | name = name
      , damageType = Elemental
      , status = Just status
      , attacks =
        [ (Shot, attacks.driver)
        , (Heavy, attacks.nova)
        , (Charge, attacks.blasterCharge)
        ]
      , inflictions =
        [ (Shot, Good, Moderate)
        , (Heavy, Good, Moderate)
        , (Charge, Good, Moderate)
        ]
      }
  in
    List.map copy variants

neutralizer : Weapon
neutralizer =
  { gun
  | name = "Neutralizer"
  , chargeTime = charge.quick
  , attacks =
    [ (Charge, attacks.neutralizer)
    , (Special, attacks.driver)
    ]
  }

biohazard : Weapon
biohazard =
  { neutralizer
  | name = "Biohazard"
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
      [ ("Gorgofist", Shadow)
      , ("Grand Tortofist", Normal)
      , ("Savage Tortofist", Piercing)
      , ("Omega Tortofist", Elemental)
      ]
    copy (name, dType) =
      { gun
      | name = name
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
      [ ("Overcharged Mixmaster", Shock)
      , ("Celestial Orbitgun", Fire)
      ]
    copy (name, status) =
      { gun
      | name = name
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
  []
  ++ (valiance :: blasters)
  ++ (nova :: umbra :: alchemers)
  ++ autoguns ++ [pepper, plague]
  ++ magnuses
  ++ antiguas ++ [obsidian]
  ++ (supernova :: pulsars)
  ++ [neutralizer, biohazard]
  ++ tortofists
  ++ mixmasters

