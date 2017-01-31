module Knight.Swords exposing (..)

import BaseTypes exposing (..)
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
  , brandishHeavyCharge = 1.24 / 1.24
  , brandishHeavySpecial = 480 / 1.24

  , fang = 566 / 1.24
  , fangFinish = 666 / 1.24
  , fangCharge = 897 / 1.24
  }

leviathan =
  { name = "Leviathan Blade"
  , damageType = Normal
  , split = False
  , status = None
  , attacks =
    [ (Basic, attacks.sword)
    , (Heavy, attacks.swordFinish)
    , (Charge, attacks.swordCharge)
    ]
  }
flourish =
  { name = "Final Flourish"
  , damageType = Piercing
  , split = False
  , status = None
  , attacks =
    [ (Basic, attacks.sword)
    , (Heavy, attacks.swordFinish)
    , (Charge, attacks.swordCharge)
    , (Special, attacks.swordChargeFinish)
    ]
  }
btb =
  { name = "Barbarous Thorn Blade"
  , damageType = Piercing
  , split = False
  , status = None
  , attacks =
    [ (Basic, attacks.sword)
    , (Heavy, attacks.swordFinish)
    , (Charge, attacks.swordCharge)
    , (Special, attacks.swordSpecial)
    ]
  }
rigadoon =
  { name = "Fearless Rigadoon"
  , damageType = Piercing
  , split = False
  , status = Stun
  , attacks =
    [ (Basic, attacks.sword)
    , (Heavy, attacks.swordFinish)
    , (Charge, attacks.swordCharge)
    , (Special, attacks.swordSpecial)
    ]
  }
flamberge =
  { rigadoon
  | name = "Furious Flamberge"
  , status = Fire
  }
suda =
  { name = "Sudaruska"
  , damageType = Normal
  , split = False
  , status = Stun
  , attacks =
    [ (Basic, attacks.swordHeavy)
    , (Heavy, attacks.swordHeavyFinish)
    , (Charge, attacks.swordHeavyCharge)
    , (Special, attacks.swordHeavyChargeFinish)
    ]
  }
triglav =
  { suda
  | name = "Triglav"
  , status = Freeze
  }
hammer = 
  { name = "Warmaster Rocket Hammer"
  , damageType = Elemental
  , split = False
  , status = None
  , attacks =
    [ (Basic, attacks.swordHeavy)
    , (Special, attacks.swordLight)
    , (Heavy, attacks.swordHeavyFinish)
    , (Charge, attacks.swordHeavyChargeFinish)
    ]
  }
combuster =
  { name = "Combuster"
  , damageType = Elemental
  , split = True
  , status = Fire
  , attacks =
    [ (Basic, attacks.brandish)
    , (Heavy, attacks.brandishFinish)
    , (Charge, attacks.brandishCharge)
    , (Special, attacks.brandishSpecial)
    ]
  }
glacius =
  { combuster
  | name = "Glacius"
  , status = Freeze
  }
voltedge =
  { combuster
  | name = "Voltedge"
  , status = Shock
  }
acheron =
  { name = "Acheron"
  , damageType = Shadow
  , split = True
  , status = None
  , attacks =
    [ (Basic, attacks.brandishHeavy)
    , (Heavy, attacks.brandishHeavyFinish)
    , (Charge, attacks.brandishHeavyCharge)
    , (Special, attacks.brandishHeavySpecial)
    ]
  }
avenger =
  { acheron
  | name = "Divine Avenger"
  , damageType = Elemental
  }
faust =
  { acheron
  | name = "Gran Faust"
  , status = Curse
  }
fang =
  { name = "Fang of Vog"
  , damageType = Elemental
  , split = True
  , status = Fire
  , attacks =
    [ (Basic, attacks.fang)
    , (Heavy, attacks.fangFinish)
    , (Charge, attacks.fangCharge)
    ]
  }

swords : List(Weapon)
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

