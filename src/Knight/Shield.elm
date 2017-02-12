module Knight.Shield exposing (..)

import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight.Status exposing (..)

aegis : Shield
aegis =
  { id = "aegis"
  , name = "Aegis"
  , effects = []
  }

bts : Shield
bts =
  { id = "bts"
  , name = "Barbarous Thorn Shield"
  , effects = [ WeaponUV (SwordDmg, Medium) ]
  }

ssb : Shield
ssb =
  { id = "ssb"
  , name = "SwiftStrike Buckler"
  , effects = [ WeaponUV (ASI, High) ]
  }

scarlet : Shield
scarlet =
  { id = "hearts"
  , name = "Scarlet Shield"
  , effects = [ Hearts 2 ]
  }

gorgo : Shield
gorgo =
  { id = "gorgo"
  , name = "Gorgomega"
  , effects = [ WeaponUV (MSI, NegLow) ]
  }

striker : Shield
striker =
  { id = "boost"
  , name = "Strike Booster"
  , effects =
    [ WeaponUV (SwordDmg, Medium)
    , WeaponUV (SwordASI, Medium)
    , WeaponUV (BombCTR, NegVeryHigh)
    ]
  }

recon : Shield
recon =
  { id = "cloak"
  , name = "Recon Cloak"
  , effects =
    [ Hearts 10
    , WeaponUV (CTR, Medium)
    , WeaponUV (GunASI, Medium)
    , WeaponUV (BombCTR, Medium)
    , WeaponUV (SwordASI, NegLow)
    ]
  }

guardian : Shield
guardian =
  let
    composeStatus status = StatusUV (status, Medium)
    statuses = List.map composeStatus [Fire, Freeze, Shock, Poison, Stun, Curse]
  in
    { id = "guard"
    , name = "Guardian Shield"
    , effects =
      [ Hearts 12
      , WeaponUV (SwordASI, Low)
      , WeaponUV (BombCTR, Low)
      , WeaponUV (GunASI, NegLow)
      ] ++ statuses
    }

shields : List Shield
shields =
  [ striker
  , recon
  , guardian
  , bts
  , ssb
  , scarlet
  , gorgo
  , aegis
  ]
