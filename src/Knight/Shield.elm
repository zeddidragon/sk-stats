module Knight.Shield exposing (..)

import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight.Status exposing (..)

aegis =
  { name = "Aegis"
  , effects = []
  }

bts =
  { name = "Barbarous Thorn Shield"
  , effects = [ WeaponUV (SwordDmg, Medium) ]
  }

ssb =
  { name = "SwiftStrike Buckler"
  , effects = [ WeaponUV (ASI, High) ]
  }

scarlet =
  { name = "Scarlet Shield"
  , effects = [ Hearts 2 ]
  }

gorgo =
  { name = "Gorgomega"
  , effects = [ WeaponUV (MSI, NegLow) ]
  }

striker =
  { name = "Strike Booster"
  , effects =
    [ WeaponUV (SwordDmg, Medium)
    , WeaponUV (SwordASI, Medium)
    , WeaponUV (BombCTR, NegVeryHigh)
    ]
  }

recon =
  { name = "Recon Cloak"
  , effects =
    [ Hearts 10
    , WeaponUV (CTR, Medium)
    , WeaponUV (GunASI, Medium)
    , WeaponUV (BombCTR, Medium)
    , WeaponUV (SwordASI, NegLow)
    ]
  }

guardian =
  let
    composeStatus status = StatusUV (status, Low)
    statuses = List.map composeStatus [Fire, Freeze, Shock, Poison, Stun, Curse]
  in
    { name = "Guardian Shield"
    , effects =
      [ Hearts 12
      , WeaponUV (SwordASI, Low)
      , WeaponUV (BombCTR, Low)
      , WeaponUV (GunASI, NegLow)
      ] ++ statuses
    }

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
