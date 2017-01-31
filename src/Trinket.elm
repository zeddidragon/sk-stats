module Trinket exposing (..)

import Armour exposing (defences)
import BaseTypes exposing (..)

jelly =
  { name = "Royal Jelly Band"
  , effects = [ DefenceUV (Piercing, High) ]
  }

crystal =
  { name = "Radiant Crystal Pin"
  , effects = [ DefenceUV (Elemental, High) ]
  }

skelly =
  { name = "Dread Skelly Charm"
  , effects = [ DefenceUV (Shadow, High) ]
  }

wetstone =
  { name = "Soaking Wetstone Pendant"
  , effects = [ StatusUV (Fire, Medium) ]
  }

hearthstone =
  { name = "Sizzling Hearthstone Pendant"
  , effects = [ StatusUV (Freeze, Medium) ]
  }

wyrmwood =
  { name = "Wyrmwood Bracelet"
  , effects = [ StatusUV (Shock, Medium) ]
  }

laurel =
  { name = "Pure White Laurel"
  , effects = [ StatusUV (Poison, Medium) ]
  }

amulet =
  { name = "Saintly Silver Amulet"
  , effects = [ StatusUV (Curse, Medium) ]
  }

penta =
  { name = "Penta-Heart Pendant"
  , effects = [ Hearts 6 ]
  }

bomb =
  { name = "Elite Bomb Focus Module"
  , effects = [ WeaponUV (BombCTR, Medium) ]
  }

boom =
  { name = "Elite Boom Module"
  , effects = [ WeaponUV (BombDmg, Medium) ]
  }

handgun =
  { name = "Elite Handgun Focus Module"
  , effects = [ WeaponUV (GunCTR, Medium) ]
  }

draw =
  { name = "Elite Quick Draw Module"
  , effects = [ WeaponUV (GunASI, Medium) ]
  }

trueshot =
  { name = "Elite Trueshot Module"
  , effects = [ WeaponUV (GunDmg, Medium) ]
  }

sword =
  { name = "Elite Sword Focus Module"
  , effects = [ WeaponUV (SwordCTR, Medium) ]
  }

strike =
  { name = "Elite Quick Strike Module"
  , effects = [ WeaponUV (SwordASI, Medium) ]
  }

slash =
  { name = "Elite Slash Module"
  , effects = [ WeaponUV (SwordDmg, Medium) ]
  }

solstice =
  { name = "Grand Solstice Ring"
  , effects =
    [ Hearts 4
    , StatusUV (Fire, Low)
    , StatusUV (Freeze, Low)
    ]
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
  ]

