module Knight.Bombs exposing (..)

import Knight.Values exposing (charge, attacks)
import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight.Status exposing (..)

bomb : Weapon
bomb =
  { id = "bomb"
  , weaponType = Bomb
  , name = "Stock Bomb"
  , damageType = Normal
  , split = Nothing
  , status = Nothing
  , chargeTime = charge.normal
  , attacks = []
  , inflictions = []
  , bonuses = []
  }

nitro : Weapon
nitro =
  { bomb
  | id = "ntr"
  , name = "Nitronome"
  , attacks = [ (Charge, attacks.nitro) ]
  }

dbb : Weapon
dbb =
  { nitro
  | id = "dbb"
  , name = "Dark Briar Barrage"
  , damageType = Piercing
  }

irontech : Weapon
irontech =
  { bomb
  | id = "irn"
  , name = "Irontech Destroyer"
  , status = Just Stun
  , chargeTime = charge.irontech
  , attacks = [ (Charge, attacks.irontech) ]
  , inflictions = [ (Charge, Fair, Minor) ]
  }

bab : Weapon
bab =
  { irontech
  | id = "bab"
  , name = "Big Angry Bomb"
  , chargeTime = charge.long
  , attacks = [ (Charge, attacks.bab) ]
  }

ash : Weapon
ash =
  { bomb
  | id = "ash"
  , name = "Ash of Agni"
  , damageType = Elemental
  , status = Just Fire
  , chargeTime = charge.long
  , attacks = [ (Charge, attacks.haze) ]
  , inflictions = [ (Charge, Good, Minor) ]
  }

shiver : Weapon
shiver =
  { ash
  | id = "shv"
  , name = "Shivermist Buster"
  , status = Just Freeze
  }

venom : Weapon
venom =
  { ash
  | id = "vv"
  , name = "Venom Veiler"
  , status = Just Poison
  }

tempest : Weapon
tempest =
  { ash
  | id = "vt"
  , name = "Voltaic Tempest"
  , status = Just Shock
  }

stagger : Weapon
stagger =
  { ash
  | id = "stg"
  , name = "Stagger Storm"
  , status = Just Stun
  }

graviton : Weapon
graviton =
  { bomb
  | id = "grv"
  , name = "Graviton Vortex"
  , damageType = Shadow
  , chargeTime = charge.long
  , attacks =
    [ (Charge, attacks.graviton)
    , (Special, attacks.gravitonCollapse)
    ]
  }
  
vortexes : List Weapon
vortexes =
  let
    variants =
      [ ("ev", "Electron Vortex", Elemental, Shock)
      , ("ogr", "Obsidian Crusher", Shadow, Poison)
      , ("fgr", "Celestial Vortex", Elemental, Fire)
      ]
    copy (id, name, dType, status) =
      { bomb
      | id = id
      , name = name
      , damageType = dType
      , chargeTime = charge.long
      , status = Just status
      , attacks =
        [ (Charge, attacks.graviton)
        , (Special, attacks.haze)
        ]
      , inflictions =
        [ (Special, Good, Strong) ]
      }
  in
    List.map copy variants

dr : Weapon
dr =
  { bomb
  | id = "dr"
  , name = "Dark Retribution"
  , damageType = Shadow
  , attacks = [ (Charge, attacks.dr) ]
  }

sss : Weapon
sss =
  { bomb
  | id = "sun"
  , name = "Scintillating Sun Shards"
  , damageType = Piercing
  , status = Just Stun
  , attacks =
    [ (Charge, attacks.shardCore)
    , (Special, attacks.shardStatus)
    ]
  , inflictions =
    [ (Charge, Fair, Moderate)
    , (Special, Fair, Moderate)
    ]
  , bonuses = [ (Fiend, VeryHigh) ]
  }

ssb : Weapon
ssb =
  { sss
  | id = "slt"
  , name = "Shocking Salt Bomb"
  , damageType = Shadow
  , status = Just Shock
  , bonuses = [ (Slime, VeryHigh) ]
  }

shards : List Weapon
shards =
  let
    variants =
      [ ("nshr", "Deadly Shard Bomb", Normal)
      , ("pshr", "Deadly Splinter Bomb", Piercing)
      , ("eshr", "Deadly Crystal Bomb", Elemental)
      , ("sshr", "Deadly Dark Matter Bomb", Shadow)
      ]
    copy (id, name, dType) =
      { bomb
      | id = id
      , name = name
      , damageType = dType
      , attacks =
        [ (Charge, attacks.shardCore)
        , (Special, attacks.shardPure)
        ]
      }
  in
    List.map copy variants

rss : Weapon
rss =
  { bomb
  | id = "rss"
  , name = "Radiant Sun Shards (Old)"
  , damageType = Piercing
  , split = Just Elemental
  , attacks = [ (Charge, attacks.shardOld) ]
  , bonuses = [ (Fiend, High) ]
  }

salt : Weapon
salt =
  { bomb
  | id = "isb"
  , name = "Ionized Salt Bomb (Old)"
  , damageType = Piercing
  , status = Just Shock
  , chargeTime = charge.painful
  , attacks = [ (Charge, attacks.saltOld) ]
  , inflictions = [ (Charge, Good, Moderate) ]
  , bonuses = [ (Slime, High) ]
  }
 
bombs : List Weapon
bombs =
  [nitro, irontech, bab, dbb]
  ++ [ash, shiver, venom, tempest, stagger]
  ++ (graviton :: vortexes)
  ++ [dr]
  ++ (sss :: ssb :: shards)
  ++ [rss, salt]
