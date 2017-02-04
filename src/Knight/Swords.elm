module Knight.Swords exposing (..)

import Knight.Types exposing (..)
import Knight.UV exposing (..)

charge =
  { normal = 2
  , long = 3
  , painful = 6
  }

attacks =
  { sword = 415 / 1.24
  , swordFinish = 477 / 1.24
  , swordCharge = 623 / 1.24
  , swordChargeFinish = 668 / 1.24
  , swordSpecial = 266 / 1.24

  , civ = 315
  , civHeavy = 353

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

  , blaster = 314 / 1.24
  , blasterCharge = 532 / 1.24

  , antigua = 231 / 1.24
  , antiguaCharge = 392 / 1.24

  , magnus = 360 / 1.24
  , magnusCharge = 611 / 1.24
  }

sword : Weapon
sword =
  { weaponType = Sword
  , name = "Stock Sword" 
  , damageType = Normal
  , split = False
  , status = Nothing
  , chargeTime = 2.2
  , attacks = []
  , inflictions = []
  , bonuses = []
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

civ : Weapon
civ =
  { sword
  | name = "Cold Iron Vanquisher"
  , attacks =
    [ (Basic, attacks.civ)
    , (Basic, attacks.civHeavy)
    , (Charge, attacks.swordLightChargeFinish)
    ]
  , bonuses =
    [ (Undead, High) ]
  }

dreams : Weapon
dreams =
  { sword
  | name = "Sweet Dreams"
  , attacks =
    [ (Basic, attacks.civ)
    , (Basic, attacks.civHeavy)
    , (Charge, attacks.swordLightChargeFinish)
    ]
  , bonuses =
    [ (Undead, Medium) ]
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

hunting : Weapon
hunting =
  { sword
  | name = "Wild Hunting Blade"
  , attacks =
    [ (Basic, attacks.blaster)
    , (Special, attacks.antigua)
    , (Charge, attacks.magnus)
    ]
  , bonuses = [ (Beast, High) ]
  }

dvs : Weapon
dvs =
  { hunting
  | name = "Dread Venom Striker"
  , status = Just Poison
  , bonuses = []
  , inflictions = everyAttack (Slight, Strong) hunting.attacks
  }

suda : Weapon
suda =
  { sword
  | name = "Sudaruska"
  , status = Just Stun
  , chargeTime = charge.long
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
    [ (Charge, Good, Strong)
    , (Special, Good, Strong)
    ]
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
  , chargeTime = charge.long
  , damageType = Elemental
  }

faust : Weapon
faust =
  { acheron
  | name = "Gran Faust"
  , status = Just Curse
  , chargeTime = charge.painful
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
    [ (Basic, Slight, Moderate)
    , (Heavy, Slight, Moderate)
    , (Charge, Good, Strong)
    ]
  }

faust4star : Weapon
faust4star =
  { faust
  | name = "Faust (4*)"
  , chargeTime = charge.long
  , attacks =
    [ (Basic, 502)
    , (Heavy, 591)
    , (Charge, 790)
    , (Special, 338)
    ]
  }

swords : List Weapon
swords =
  [ leviathan
  , civ
  , flourish
  , btb
  , rigadoon
  , flamberge
  , hunting
  , dvs
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
  , faust4star
  ]

