module Knight.Swords exposing (..)

import Knight.Status exposing (..)
import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight.Values exposing (attacks, charge)


sword : Weapon
sword =
    { id = "sword"
    , weaponType = Sword
    , name = "Stock Sword"
    , damageType = Normal
    , split = Nothing
    , status = Nothing
    , chargeTime = charge.normal
    , attacks = []
    , inflictions = []
    , bonuses = []
    }


leviathan : Weapon
leviathan =
    { sword
        | id = "lev"
        , name = "Leviathan Blade"
        , attacks =
            [ ( Basic, attacks.sword )
            , ( Heavy, attacks.swordFinish )
            , ( Charge, attacks.swordCharge )
            ]
    }


civ : Weapon
civ =
    { sword
        | id = "civ"
        , name = "Cold Iron Vanquisher"
        , attacks =
            [ ( Basic, attacks.civ )
            , ( Heavy, attacks.civHeavy )
            , ( Charge, attacks.swordLightChargeFinish )
            ]
        , bonuses =
            [ ( Undead, High ) ]
    }


amputator : Weapon
amputator =
    { civ
        | id = "amp"
        , name = "Amputator"
        , attacks =
            civ.attacks
                ++ [ ( Special, attacks.blaster ) ]
        , bonuses =
            [ ( Slime, High ) ]
    }


dreams : Weapon
dreams =
    { sword
        | id = "drm"
        , name = "Sweet Dreams"
        , attacks =
            [ ( Basic, attacks.civ )
            , ( Basic, attacks.civHeavy )
            , ( Charge, attacks.swordLightChargeFinish )
            ]
        , status = Just Stun
        , bonuses =
            [ ( Undead, Medium ) ]
        , inflictions =
            [ ( Charge, Good, Moderate ) ]
    }


csaber : Weapon
csaber =
    { leviathan
        | id = "csaber"
        , name = "Celestial Saber"
        , status = Just Fire
        , inflictions =
            [ ( Charge, Good, Moderate ) ]
    }


flourish : Weapon
flourish =
    { sword
        | id = "ff"
        , name = "Final Flourish"
        , damageType = Piercing
        , attacks =
            [ ( Basic, attacks.sword )
            , ( Heavy, attacks.swordFinish )
            , ( Charge, attacks.swordCharge )
            , ( Special, attacks.swordChargeFinish )
            ]
    }


btb : Weapon
btb =
    { sword
        | id = "btb"
        , name = "Barbarous Thorn Blade"
        , damageType = Piercing
        , attacks =
            [ ( Basic, attacks.sword )
            , ( Heavy, attacks.swordFinish )
            , ( Charge, attacks.swordCharge )
            , ( Special, attacks.swordSpecial )
            ]
    }


everyAttack ( chance, strength ) attacks =
    let
        merge ( stage, damage ) =
            ( stage, chance, strength )
    in
    List.map merge attacks


rigadoon : Weapon
rigadoon =
    let
        rigadoonAttacks =
            [ ( Basic, attacks.swordLight )
            , ( Heavy, attacks.swordLightFinish )
            , ( Charge, attacks.swordLightCharge )
            , ( Special, attacks.swordLightChargeFinish )
            ]
    in
    { sword
        | id = "rig"
        , name = "Fearless Rigadoon"
        , damageType = Piercing
        , status = Just Stun
        , attacks = rigadoonAttacks
        , inflictions =
            everyAttack ( Slight, Moderate ) rigadoonAttacks
    }


flamberge : Weapon
flamberge =
    { rigadoon
        | id = "fla"
        , name = "Furious Flamberge"
        , status = Just Fire
        , inflictions =
            [ ( Basic, Slight, Moderate )
            , ( Heavy, Slight, Moderate )
            , ( Charge, Fair, Moderate )
            , ( Special, Fair, Moderate )
            ]
    }


hunting : Weapon
hunting =
    { sword
        | id = "whb"
        , name = "Wild Hunting Blade"
        , attacks =
            [ ( Basic, attacks.blaster )
            , ( Special, attacks.antigua )
            , ( Charge, attacks.magnus )
            ]
        , bonuses = [ ( Beast, High ) ]
    }


dvs : Weapon
dvs =
    { hunting
        | id = "dvs"
        , name = "Dread Venom Striker"
        , status = Just Poison
        , bonuses = []
        , inflictions = everyAttack ( Slight, Strong ) hunting.attacks
    }


turbillion : Weapon
turbillion =
    { sword
        | id = "trb"
        , name = "Turbillion"
        , attacks =
            [ ( Basic, attacks.swordLight )
            , ( Shot, attacks.antigua )
            , ( Heavy, attacks.swordLightFinish )
            , ( Charge, attacks.swordLightCharge )
            , ( Special, attacks.driver )
            ]
    }


suda : Weapon
suda =
    { sword
        | id = "sud"
        , name = "Sudaruska"
        , status = Just Stun
        , chargeTime = charge.long
        , attacks =
            [ ( Basic, attacks.swordHeavy )
            , ( Heavy, attacks.swordHeavyFinish )
            , ( Charge, attacks.swordHeavyCharge )
            , ( Special, attacks.swordHeavyChargeFinish )
            ]
        , inflictions =
            [ ( Special, Fair, Moderate ) ]
    }


triglav : Weapon
triglav =
    { suda
        | id = "tri"
        , name = "Triglav"
        , status = Just Freeze
        , inflictions =
            ( Heavy, Slight, Moderate ) :: suda.inflictions
    }


hammer : Weapon
hammer =
    { sword
        | id = "wrh"
        , name = "Warmaster Rocket Hammer"
        , damageType = Elemental
        , attacks =
            [ ( Basic, attacks.swordHeavy )
            , ( Special, attacks.swordLight )
            , ( Heavy, attacks.swordHeavyFinish )
            , ( Charge, attacks.swordHeavyChargeFinish )
            ]
    }


combuster : Weapon
combuster =
    { sword
        | id = "cmb"
        , name = "Combuster"
        , damageType = Elemental
        , split = Just Normal
        , status = Just Fire
        , attacks =
            [ ( Basic, attacks.brandish )
            , ( Heavy, attacks.brandishFinish )
            , ( Charge, attacks.brandishCharge )
            , ( Special, attacks.brandishSpecial )
            ]
        , inflictions =
            [ ( Charge, Good, Strong )
            , ( Special, Good, Strong )
            ]
    }


glacius : Weapon
glacius =
    { combuster
        | id = "glc"
        , name = "Glacius"
        , status = Just Freeze
    }


voltedge : Weapon
voltedge =
    { combuster
        | id = "vlt"
        , name = "Voltedge"
        , status = Just Shock
    }


obsidian : Weapon
obsidian =
    { combuster
        | id = "obs"
        , name = "Obsidian Edge"
        , damageType = Shadow
        , status = Just Poison
    }


acheron : Weapon
acheron =
    { sword
        | id = "ach"
        , name = "Acheron"
        , damageType = Shadow
        , split = Just Normal
        , attacks =
            [ ( Basic, attacks.brandishHeavy )
            , ( Heavy, attacks.brandishHeavyFinish )
            , ( Charge, attacks.brandishHeavyCharge )
            , ( Special, attacks.brandishHeavySpecial )
            ]
    }


avenger : Weapon
avenger =
    { acheron
        | id = "da"
        , name = "Divine Avenger"
        , chargeTime = charge.long
        , damageType = Elemental
    }


faust : Weapon
faust =
    { acheron
        | id = "gf"
        , name = "Gran Faust"
        , status = Just Curse
        , chargeTime = charge.painful
        , inflictions =
            [ ( Heavy, Slight, Strong )
            , ( Charge, Fair, Strong )
            , ( Special, Fair, Strong )
            ]
    }


fang : Weapon
fang =
    { sword
        | id = "fov"
        , name = "Fang of Vog"
        , damageType = Elemental
        , split = Just Normal
        , status = Just Fire
        , attacks =
            [ ( Basic, attacks.fang )
            , ( Heavy, attacks.fangFinish )
            , ( Charge, attacks.fangCharge )
            ]
        , inflictions =
            [ ( Basic, Slight, Moderate )
            , ( Heavy, Slight, Moderate )
            , ( Charge, Good, Strong )
            ]
    }


winmillion : Weapon
winmillion =
    { sword
        | id = "win"
        , name = "Winmillion"
        , attacks =
            [ ( Basic, 300 / 1.24 )
            , ( Shot, 220 / 1.24 )
            , ( Heavy, 345 / 1.24 )
            , ( Charge, 563 / 1.24 )
            , ( Special, 322 / 1.24 )
            ]
    }


faust4star : Weapon
faust4star =
    { faust
        | id = "fau"
        , name = "Faust (4*)"
        , chargeTime = charge.long
        , attacks =
            [ ( Basic, 502 )
            , ( Heavy, 591 )
            , ( Charge, 790 )
            , ( Special, 338 )
            ]
    }


swords : List Weapon
swords =
    [ leviathan
    , civ
    , dreams
    , csaber
    , amputator
    , flourish
    , btb
    , rigadoon
    , flamberge
    , hunting
    , dvs
    , turbillion
    , suda
    , triglav
    , hammer
    , combuster
    , glacius
    , voltedge
    , acheron
    , obsidian
    , avenger
    , faust
    , fang
    , winmillion
    , faust4star
    ]
