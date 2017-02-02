module Knight.Swords exposing (..)

import Knight.Types exposing (..)
import Knight.UV exposing (..)

attacks =
  { sword = 415 / 1.24
  , swordFinish = 477 / 1.24
  , swordCharge = 623 / 1.24
  , swordChargeFinish = 668 / 1.24
  , swordSpecial = 266 / 1.24

  , swordLight = 358 / 1.24
  , swordLightFinish = 411 / 1.24
  , swordLightCharge = 537 / 1.24
  , swordLightChargeFinish = 587 / 1.24

  , swordHeavy = 477 / 1.24
  , swordHeavyFinish = 548 / 1.24
  , swordHeavyCharge = 668 / 1.24
  , swordHeavyChargeFinish = 715 / 1.24

  , brandish = 609 / 1.24
  , brandishFinish = 711 / 1.24
  , brandishCharge = 959 / 1.24
  , brandishSpecial = 447 / 1.24

  , brandishHeavy = 656 / 1.24
  , brandishHeavyFinish = 774 / 1.24
  , brandishHeavyCharge = 1040 / 1.24
  , brandishHeavySpecial = 480 / 1.24

  , fang = 566 / 1.24
  , fangFinish = 666 / 1.24
  , fangCharge = 897 / 1.24
  }

sword : Weapon
sword =
  { weaponType = Sword
  , name = "Stock Sword" 
  , damageType = Normal
  , split = False
  , status = Nothing
  , attacks = []
  , inflictions = []
  }

leviathan : Weapon
leviathan =
  { sword
  | name = "Leviathan Blade"
  , attacks =
    [ (Basic, attacks.sword)
    , (Heavy, attacks.swordFinish)
    , (Charge, attacks.swordCharge)
    ]
  }

flourish : Weapon
flourish =
  { sword
  | name = "Final Flourish"
  , damageType = Piercing
  , attacks =
    [ (Basic, attacks.sword)
    , (Heavy, attacks.swordFinish)
    , (Charge, attacks.swordCharge)
    , (Special, attacks.swordChargeFinish)
    ]
  }

btb : Weapon
btb =
  { sword
  | name = "Barbarous Thorn Blade"
  , damageType = Piercing
  , attacks =
    [ (Basic, attacks.sword)
    , (Heavy, attacks.swordFinish)
    , (Charge, attacks.swordCharge)
    , (Special, attacks.swordSpecial)
    ]
  }

everyAttack (chance, strength) attacks =
  let
    merge (stage, damage) = (stage, chance, strength)
  in
    List.map merge attacks

rigadoon : Weapon
rigadoon =
  let
    rigadoonAttacks = 
      [ (Basic, attacks.swordLight)
      , (Heavy, attacks.swordLightFinish)
      , (Charge, attacks.swordLightCharge)
      , (Special, attacks.swordLightChargeFinish)
      ]
  in
    { sword
    | name = "Fearless Rigadoon"
    , damageType = Piercing
    , status = Just Stun
    , attacks = rigadoonAttacks
    , inflictions =
      everyAttack (Slight, Moderate) rigadoonAttacks
    }

flamberge : Weapon
flamberge =
  { rigadoon
  | name = "Furious Flamberge"
  , status = Just Fire
  , inflictions =
    everyAttack (Fair, Moderate) rigadoon.attacks
  }

suda : Weapon
suda =
  { sword
  | name = "Sudaruska"
  , status = Just Stun
  , attacks =
    [ (Basic, attacks.swordHeavy)
    , (Heavy, attacks.swordHeavyFinish)
    , (Charge, attacks.swordHeavyCharge)
    , (Special, attacks.swordHeavyChargeFinish)
    ]
  , inflictions =
    [ (Special, Fair, Moderate) ]
  }

triglav : Weapon
triglav =
  { suda
  | name = "Triglav"
  , status = Just Freeze
  , inflictions =
    (Heavy, Slight, Moderate) :: suda.inflictions
  }

hammer : Weapon
hammer = 
  { sword
  | name = "Warmaster Rocket Hammer"
  , damageType = Elemental
  , attacks =
    [ (Basic, attacks.swordHeavy)
    , (Special, attacks.swordLight)
    , (Heavy, attacks.swordHeavyFinish)
    , (Charge, attacks.swordHeavyChargeFinish)
    ]
  }

combuster : Weapon
combuster =
  { sword
  | name = "Combuster"
  , damageType = Elemental
  , split = True
  , status = Just Fire
  , attacks =
    [ (Basic, attacks.brandish)
    , (Heavy, attacks.brandishFinish)
    , (Charge, attacks.brandishCharge)
    , (Special, attacks.brandishSpecial)
    ]
  , inflictions =
    [ (Charge, Good, Strong) ]
  }

glacius : Weapon
glacius =
  { combuster
  | name = "Glacius"
  , status = Just Freeze
  }

voltedge : Weapon
voltedge =
  { combuster
  | name = "Voltedge"
  , status = Just Shock
  }

acheron : Weapon
acheron =
  { sword
  | name = "Acheron"
  , damageType = Shadow
  , split = True
  , attacks =
    [ (Basic, attacks.brandishHeavy)
    , (Heavy, attacks.brandishHeavyFinish)
    , (Charge, attacks.brandishHeavyCharge)
    , (Special, attacks.brandishHeavySpecial)
    ]
  }

avenger : Weapon
avenger =
  { acheron
  | name = "Divine Avenger"
  , damageType = Elemental
  }

faust : Weapon
faust =
  { acheron
  | name = "Gran Faust"
  , status = Just Curse
  , inflictions =
    [ (Heavy, Slight, Strong)
    , (Charge, Fair, Strong)
    , (Special, Fair, Strong)
    ]
  }

fang : Weapon
fang =
  { sword
  | name = "Fang of Vog"
  , damageType = Elemental
  , split = True
  , status = Just Fire
  , attacks =
    [ (Basic, attacks.fang)
    , (Heavy, attacks.fangFinish)
    , (Charge, attacks.fangCharge)
    ]
  , inflictions =
    [ (Basic, Fair, Moderate)
    , (Heavy, Fair, Moderate)
    , (Charge, Good, Strong)
    ]
  }

swords : List Weapon
swords =
  [ leviathan
  , flourish
  , btb
  , rigadoon
  , flamberge
  , suda
  , triglav
  , hammer
  , combuster
  , glacius
  , voltedge
  , acheron
  , avenger
  , faust
  , fang
  ]

