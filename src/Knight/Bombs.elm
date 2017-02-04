module Knight.Bombs exposing (..)

import Knight.Values exposing (charge, attacks)
import Knight.Types exposing (..)
import Knight.UV exposing (..)

bomb : Weapon
bomb =
  { weaponType = Bomb
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
  | name = "Nitronome"
  , attacks = [ (Charge, attacks.nitro) ]
  }

dbb : Weapon
dbb =
  { nitro
  | name = "Dark Briar Barrage"
  , damageType = Piercing
  }

heavies : List Weapon
heavies =
  let
    variants =
      [ ("Irontech Destroyer", attacks.irontech, charge.irontech)
      , ("Big Angry Bomb", attacks.bab, charge.long)
      ]
    copy (name, damage, chargeTime) =
      { bomb
      | name = name
      , status = Just Stun
      , chargeTime = chargeTime
      , attacks = [ (Charge, damage) ]
      , inflictions = [ (Charge, Fair, Minor) ]
      }
  in
    List.map copy variants

hazes : List Weapon
hazes =
  let
    variants =
      [ ("Ash of Agni", Fire)
      , ("Shivermist Buster", Freeze)
      , ("Venom Veiler", Poison)
      , ("Voltaic Tempest", Shock)
      , ("Stagger Storm", Stun)
      ]
    copy (name, status) =
      { bomb
      | name = name
      , damageType = Elemental
      , status = Just status
      , chargeTime = charge.long
      , attacks = [ (Charge, attacks.haze) ]
      , inflictions = [ (Charge, Good, Minor) ]
      }
  in
    List.map copy variants

graviton : Weapon
graviton =
  { bomb
  | name = "Graviton Vortex"
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
      [ ("Electron Vortex", Elemental, Shock)
      , ("Obsidian Crusher", Shadow, Poison)
      , ("Celestial Vortex", Elemental, Fire)
      ]
    copy (name, dType, status) =
      { bomb
      | name = name
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
  | name = "Dark Retribution"
  , damageType = Shadow
  , attacks = [ (Charge, attacks.dr) ]
  }

sss : Weapon
sss =
  { bomb
  | name = "Scintillating Sun Shards"
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
  | name = "Shocking Salt Bomb"
  , damageType = Shadow
  , status = Just Shock
  , bonuses = [ (Slime, VeryHigh) ]
  }

shards : List Weapon
shards =
  let
    variants =
      [ ("Deadly Shard Bomb", Normal)
      , ("Deadly Splinter Bomb", Piercing)
      , ("Deadly Crystal Bomb", Elemental)
      , ("Deadly Dark Matter Bomb", Shadow)
      ]
    copy (name, dType) =
      { bomb
      | name = name
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
  | name = "Radiant Sun Shards (Old)"
  , damageType = Piercing
  , split = Just Elemental
  , attacks = [ (Charge, attacks.shardOld) ]
  , bonuses = [ (Fiend, High) ]
  }

salt : Weapon
salt =
  { bomb
  | name = "Ionized Salt Bomb (Old)"
  , damageType = Piercing
  , status = Just Shock
  , chargeTime = charge.painful
  , attacks = [ (Charge, attacks.saltOld) ]
  , inflictions = [ (Charge, Good, Moderate) ]
  , bonuses = [ (Slime, High) ]
  }
 
bombs : List Weapon
bombs =
  []
  ++ (nitro :: dbb :: heavies)
  ++ hazes
  ++ (graviton :: vortexes)
  ++ [dr]
  ++ (sss :: ssb :: shards)
  ++ [rss, salt]
