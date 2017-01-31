module Armour exposing (..)

import BaseTypes exposing (..)
import UV exposing (..)

uvMax = 25.6

defences =
  { base = 125 / 2
  , class = 142 / 2
  , special = 150 / 2
  , plate = 200 / 2
  , ancient = 300 / 2
  , uvLow = uvMax  * 1 / 4
  , uvMed = uvMax  * 2 / 4
  , uvHigh = uvMax * 3 / 4
  , uvMax = uvMax
  }

uvToDefence strength =
  case strength of
    Low -> defences.uvLow
    Medium -> defences.uvMed
    High -> defences.uvHigh
    Maximum -> defences.uvMax
    _ -> 0

uvToResistance strength =
  case strength of
    Low -> 1
    Medium -> 2
    High -> 3
    Maximum -> 4
    _ -> 0

base =
  { hearts = 5
  , name = "Base Armour"
  , defences = [ (Normal, defences.base) ]
  , resistances = []
  , bonuses = []
  }

class = { base | defences = [ (Normal, defences.class) ] }

plate =
  { class
  | defences = [ (Normal, defences.plate) ]
  , resistances = [ (Stun, 4) ]
  }

cobalt =
  { base
  | name = "Cobalt"
  , defences = [ (Piercing, defences.base), (Normal, defences.special) ]
  }

skolver =
  { class
  | name = "Skolver"
  , defences = (Piercing, defences.base) :: class.defences
  , resistances = [ (Freeze, 4) ]
  , bonuses = [ (SwordDmg, Medium) ]
  }
  
vog =
  { class
  | name = "Vog Cub"
  , defences = (Elemental, defences.base) :: class.defences
  , resistances = [ (Fire, 4) ]
  , bonuses = [ (SwordASI, Medium) ]
  }

snarby =
  { skolver
  | name = "Snarbolax"
  , defences = (Shadow, defences.base) :: class.defences
  , resistances =
    [ (Freeze, 3)
    , (Poison, 3)
    ]
  }


justifier =
  { skolver
  | name = "Justifier"
  , resistances = [ (Stun, 4) ]
  , bonuses = [ (GunASI, Medium) ]
  }

nameless =
  { vog
  | name = "Nameless"
  , resistances = [ (Freeze, 4) ]
  , bonuses = [ (GunASI, Medium) ]
  }

shadowsun =
  { snarby
  | name = "Shadowsun"
  , resistances = [ (Poison, 4) ]
  , bonuses = [ (GunDmg, Medium) ]
  }

deadshot =
  { shadowsun
  | name = "Deadshot"
  , resistances = [ (Curse, 4) ]
  , bonuses =
    [ (GunASI, Low)
    , (Undead, Low)
    ]
  }


volcDemo =
  { vog
  | name = "Volcanic Demo"
  , bonuses = [ (BombCTR, Medium) ]
  }

bombastic =
  { nameless
  | name = "Bombastic Demo"
  , bonuses = [ (BombDmg, Medium) ]
  }

mercDemo =
  { volcDemo
  | name = "Mercurial Demo"
  , resistances = [ (Shock, 4) ]
  , bonuses =
    [ (BombDmg, Low)
    , (Msi, Low)
    ]
  }

mad =
  { base
  | name = "Mad Bomber"
  , defences = (Elemental, defences.base) :: base.defences
  , resistances =
    [ (Fire, -2)
    , (Freeze, -2)
    , (Shock, -2)
    , (Poison, -2)
    ]
  , bonuses =
    [ (BombDmg, Medium)
    , (BombCTR, Medium)
    ]
  }

chaos =
  { mad
  | name = "Chaos"
  , resistances = (Curse, -2) :: mad.resistances
  , bonuses = 
    [ (Dmg, Medium)
    , (CTR, Medium)
    ]
  }

kat =
  { base
  | name = "Black Kat"
  , defences = (Shadow, defences.base) :: base.defences
  , resistances =
    [ (Freeze, 4)
    , (Fire, -2)
    , (Shock, -2)
    , (Poison, -2)
    , (Curse, -4)
    ]
  , bonuses =
    [ (Dmg, High)
    , (Msi, High)
    ]
  }

claw =
  { base
  | name = "Kat Claw"
  , defences = (Shadow, defences.special) :: base.defences
  , resistances =
    [ (Freeze, 4)
    , (Shock, -2)
    , (Curse, -1)
    ]
  , bonuses =
    [ (SwordDmg, Low)
    , (SwordASI, Low)
    ]
  }

eye =
  { claw
  | name = "Kat Eye"
  , bonuses =
    [ (GunDmg, Low)
    , (GunASI, Low)
    ]
  }

hiss =
  { claw
  | name = "Kat Hiss"
  , bonuses =
    [ (BombDmg, Low)
    , (BombCTR, Low)
    ]
  }

ironmight =
  { plate
  | name = "Ironmight Plate"
  , defences = (Piercing, defences.base) :: plate.defences
  , bonuses =
    [ (ASI, NegLow)
    ]
  }

volcPlate =
  { plate
  | name = "Volcanic Plate"
  , defences = (Elemental, defences.base) :: plate.defences
  , resistances = (Fire, 4) :: plate.resistances
  , bonuses = ironmight.bonuses
  }

ancient =
  { plate
  | name = "Ancient Plate"
  , hearts = 8
  , defences = [ (Normal, defences.ancient) ]
  , bonuses = ironmight.bonuses ++ [ (Msi, NegLow) ]
  }

armours =
  [ cobalt

  , skolver
  , vog
  , snarby

  , justifier
  , nameless
  , shadowsun
  , deadshot

  , volcDemo
  , bombastic
  , mad
  , mercDemo

  , ironmight
  , volcPlate
  , ancient

  , chaos
  , kat

  , claw
  , eye
  , hiss
  ]
