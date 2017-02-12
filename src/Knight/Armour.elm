module Knight.Armour exposing (..)

import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight.Status exposing (..)

base =
  { id = "base"
  , hearts = 5
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
  | id = "azure"
  , name = "Azure Guardian"
  , defences =
    [ (Piercing, defences.base)
    , (Normal, defences.special)
    ]
  }

crusader =
  { base
  | id = "almire"
  , name = "Almirian Crusader"
  , defences =
    [ (Shadow, defences.base)
    , (Normal, defences.special)
    ]
  , resistances =
    [ (Fire, -2)
    , (Curse, 2)
    ]
  }

skolver =
  { class
  | id = "skolv"
  , name = "Skolver"
  , defences = (Piercing, defences.base) :: class.defences
  , resistances = [ (Freeze, 4) ]
  , bonuses = [ (SwordDmg, Medium) ]
  }
  
vog =
  { class
  | id = "vog"
  , name = "Vog Cub"
  , defences = (Elemental, defences.base) :: class.defences
  , resistances = [ (Fire, 4) ]
  , bonuses = [ (SwordASI, Medium) ]
  }

snarby =
  { skolver
  | id = "snarb"
  , name = "Snarbolax"
  , defences = (Shadow, defences.base) :: class.defences
  , resistances =
    [ (Freeze, 3)
    , (Poison, 3)
    ]
  }


justifier =
  { skolver
  | id = "just"
  , name = "Justifier"
  , resistances = [ (Stun, 4) ]
  , bonuses = [ (GunASI, Medium) ]
  }

nameless =
  { vog
  | id = "name"
  , name = "Nameless"
  , resistances = [ (Freeze, 4) ]
  , bonuses = [ (GunASI, Medium) ]
  }

shadowsun =
  { snarby
  | id = "sun"
  , name = "Shadowsun"
  , resistances = [ (Poison, 4) ]
  , bonuses = [ (GunDmg, Medium) ]
  }

deadshot =
  { shadowsun
  | id = "dead"
  , name = "Deadshot"
  , resistances = [ (Curse, 4) ]
  , bonuses =
    [ (GunASI, Low)
    , (Undead, Low)
    ]
  }


volcDemo =
  { vog
  | id = "demo"
  , name = "Volcanic Demo"
  , bonuses = [ (BombCTR, Medium) ]
  }

bombastic =
  { nameless
  | id = "bomba"
  , name = "Bombastic Demo"
  , bonuses = [ (BombDmg, Medium) ]
  }

mercDemo =
  { volcDemo
  | id = "mdemo"
  , name = "Mercurial Demo"
  , resistances = [ (Shock, 4) ]
  , bonuses =
    [ (BombDmg, Low)
    , (MSI, Low)
    ]
  }

mad =
  { base
  | id = "mad"
  , name = "Mad Bomber"
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

jelly =
  { base
  | id = "jelly"
  , name = "Royal Jelly"
  , defences = (Piercing, defences.special) :: base.defences
  , resistances =
    [ (Stun, 4)
    , (Sleep, 4)
    ]
  }

merc =
  { jelly
  | id = "merc"
  , name = "Mercurial Jelly"
  , resistances = [ (Shock, 4) ]
  }

queen =
  { jelly
  | id = "iq"
  , name = "Ice Queen"
  , resistances =
    [ (Stun, 4)
    , (Freeze, 4)
    ]
  }

gray =
  { base
  | id = "gray"
  , name = "Gray Feather"
  , defences = (Elemental, defences.special) :: base.defences
  , resistances =
    [ (Fire, 4)
    , (Shock, 4)
    ]
  }

divine =
  { base
  | id = "divine"
  , name = "Divine"
  , defences = 
    [ (Elemental, defences.class)
    , (Shadow, defences.class)
    ]
  , resistances =
    [ (Fire, 4)
    , (Shock, 4)
    , (Curse, 4)
    ]
  , bonuses = [ (Fiend, Medium) ]
  }

skelly =
  { base
  | id = "skelly"
  , name = "Dread Skelly"
  , defences = (Shadow, defences.special) :: base.defences
  , resistances =
    [ (Freeze, 4)
    , (Poison, 4)
    ]
  }

chaos =
  { mad
  | id = "chaos"
  , name = "Chaos"
  , resistances = (Curse, -2) :: mad.resistances
  , bonuses = 
    [ (Dmg, Medium)
    , (CTR, Medium)
    ]
  }

kat =
  { base
  | id = "kat"
  , name = "Black Kat"
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
    , (MSI, Low)
    ]
  }

claw =
  { base
  | id = "claw"
  , name = "Kat Claw"
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
  | id = "eye"
  , name = "Kat Eye"
  , bonuses =
    [ (GunDmg, Low)
    , (GunASI, Low)
    ]
  }

hiss =
  { claw
  | id = "hiss"
  , name = "Kat Hiss"
  , bonuses =
    [ (BombDmg, Low)
    , (BombCTR, Low)
    ]
  }

ironmight =
  { plate
  | id = "iron"
  , name = "Ironmight Plate"
  , defences = (Piercing, defences.base) :: plate.defences
  , bonuses =
    [ (ASI, NegLow)
    ]
  }

volcPlate =
  { plate
  | id = "vplate"
  , name = "Volcanic Plate"
  , defences = (Elemental, defences.base) :: plate.defences
  , resistances = (Fire, 4) :: plate.resistances
  , bonuses = ironmight.bonuses
  }

ancient =
  { plate
  | id = "ancient"
  , name = "Ancient Plate"
  , hearts = 8
  , defences = [ (Normal, defences.ancient) ]
  , bonuses = ironmight.bonuses ++ [ (MSI, NegLow) ]
  }

seerus =
  { base
  | id = "pmos"
  , name = "Perfect Mask of Seerus"
  , defences = (Elemental, defences.class) :: class.defences
  , resistances =
    [ (Fire, 4)
    , (Freeze, -2)
    , (Shock, 4)
    , (Poison, -2)
    ]
  , bonuses =
    [ (GunCTR, Medium)
    , (GunASI, Low)
    ]
  }

valkyrie =
  { base
  | id = "valk"
  , name = "Valkyrie"
  , defences =
    [ (Shadow, defences.base)
    , (Normal, defences.base)
    ]
  , resistances =
    [ (Fire, -4)
    , (Poison, 4)
    , (Curse, 4)
    ]
  , bonuses = [ (Fiend, Low) ]
  }

fallen =
  { valkyrie
  | id = "fallen"
  , name = "Fallen"
  , resistances =
    [ (Fire, 4)
    , (Poison, 4)
    , (Curse, -4)
    ]
  , bonuses =
    [ (Fiend, NegLow)
    , (ASI, Low)
    ]
  }

heavenly =
  { base
  | id = "heaven"
  , name = "Heavenly Iron"
  , defences = (Shadow, defences.base) :: class.defences
  , resistances =
    [ (Shock, -4)
    , (Curse, 4)
    ]
  , bonuses =
    [ (Fiend, Low)
    , (SwordDmg, Low)
    ]
  }

virulisk =
  { base
  | id = "viru"
  , name = "Deadly Virulisk"
  , defences = (Piercing, defences.base) :: class.defences
  , resistances = [ (Poison, 4) ]
  , bonuses = [ (Slime, Medium) ]
  }

salamander =
  { virulisk
  | id = "sal"
  , name = "Volcanic Salamander"
  , defences = (Elemental, defences.base) :: class.defences
  , resistances = [ (Fire, 4) ]
  }

arcane =
  { salamander
  | id = "arcane"
  , name = "Arcane Salamander"
  , defences = (Elemental, defences.class) :: class.defences
  , bonuses =
    [ (Slime, Low)
    , (Beast, Low)
    ]
  }

dragon =
  { base
  | id = "scale"
  , name = "Dragon Scale"
  , defences =
    [ (Piercing, defences.class)
    , (Elemental, defences.class)
    ]
  , resistances =
    [ (Fire, 4)
    , (Poison, 4)
    ]
  , bonuses = [ (Beast, Medium) ]
  }

silver =
  { base
  | id = "silver"
  , name = "Radiant Silvermail"
  , defences =
    [ (Piercing, defences.class)
    , (Shadow, defences.class)
    ]
  , resistances =
    [ (Curse, 4)
    , (Poison, 4)
    ]
  , bonuses = [ (Undead, Medium) ]
  }

armours =
  [ cobalt
  , crusader

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

  , jelly
  , queen
  , merc

  , gray
  , divine
  , chaos
  
  , skelly

  , ironmight
  , volcPlate
  , ancient

  , virulisk
  , salamander
  , arcane

  , dragon
  , silver

  , valkyrie
  , fallen
  , heavenly

  , kat

  , claw
  , eye
  , hiss
  
  , seerus
  ] ++ gunnerSets

gunnerSets =
  let
    statusName status =
      case status of
        Fire -> "Firefly"
        Shock -> "Falcon"
        Freeze -> "Grizzly"
        Poison -> "Snakebite"
        _ -> toString status
    counter status =
      case status of
        Fire -> Shock
        Shock -> Freeze
        Freeze -> Poison
        Poison -> Fire
        _ -> status
    toBonus family = (family, Medium)
    families dType =
      case dType of
        Piercing -> [Slime, Beast]
        Elemental -> [Construct, Gremlin]
        Shadow -> [Undead, Fiend]
        _ -> [BombDmg, BombCTR]
    defenceName dType =
      case dType of
        Piercing -> "Pathfinder"
        Elemental -> "Sentinel"
        Shadow -> "Shade"
        _ -> "WAT?"
    familyName bonus defence =
      case Tuple.first bonus of
        Beast -> "Guerilla"
        Slime -> "Hazard"
        Undead -> "Ghost"
        Fiend -> "Hex"
        Gremlin -> "Wraith"
        Construct -> "Keeper"
        _ -> defenceName defence
    statuses = [ Fire, Shock, Freeze, Poison ]
    damageTypes = [ Piercing, Elemental, Shadow ]
    familyPaths defence =
      let
        bonuses = (GunDmg, Low) :: List.map toBonus (families defence)
      in
        List.concatMap (statusPaths defence) bonuses
    statusPaths defence bonus =
      List.map (compose defence bonus) statuses
    compose defence bonus status =
      { base
      | id = String.toLower <| String.join ""
        [ "gun"
        , String.slice 0 1 <| toString defence
        , String.slice 0 2 <| toString status
        , String.slice 0 2 <| toString <| Tuple.first bonus
        ]
      , name =
        String.join " "
        [ "Sacred"
        , statusName status
        , familyName bonus defence
        ]
      , defences = (defence, defences.base) :: base.defences
      , resistances =
        [ (status, 4)
        , (counter status, -3)
        ]
      , bonuses =
        [ (GunCTR, Low)
        , (GunASI, Low)
        , bonus
        ]
      }
  in
    List.concatMap familyPaths damageTypes
