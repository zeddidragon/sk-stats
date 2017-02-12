module Events.View exposing (log)

import Events exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Knight exposing (..)
import Knight.UV exposing (..)
import Knight.Types exposing (..)
import Knight.Status exposing (..)
import View.Shortcuts exposing (toText, button)
import Util exposing (find, remove, pretty)

unknownWeapon : Weapon
unknownWeapon =
  { name = "Unknown Weapon"
  , weaponType = Sword
  , damageType = Normal
  , chargeTime = 0
  , split = Nothing
  , status = Nothing
  , attacks = []
  , inflictions = []
  , bonuses = []
  }

unknownAttack : (Stage, Float)
unknownAttack = (Basic, 0)

unknownEquip : WeaponEquip
unknownEquip =
  { piece = unknownWeapon
  , uvs = []
  }

log message events left right =
  let
    opposing side = if side == Left then Right else Left
    getKnight side = if side == Left then left else right
    getOpponent side = if side == Left then right else left
    getWeapon name =
      weapons
        |> find (\w -> w.name == name)
        |> Maybe.withDefault unknownWeapon
    eventLog index output events =
      case events of
        [] -> output
        x::xs -> eventEntry index xs x :: eventLog (index + 1) output xs
    button index =
      div
        [ class "button"
        , onClick <| message <| remove index events
        ] [ text "-" ]
    eventEntry index history (side, event) =
      let
        knight = getKnight side
        opponent = getOpponent side
      in
        case event of
          Attack (weaponName, stage)->
            let
              damage = Events.damage True side left right history (side, event)
            in
              div [ class <| "event " ++ (toString side) ]
                [ div [ class "attack flow header" ]
                  [ div [ class "knight-name" ] [ text <| .name <| knight ]
                  , div [ class "weapon" ] [ text weaponName ]
                  , button index
                  ]
                , div [ class "attack flow" ]
                  [ div [ class "attack-stage" ] [ toText stage ]
                  , div [ class "attack-damage" ] [ toText <| ceiling <| damage ]
                  ]
                ]
          Infliction (status, strength)->
            let
              resistance = Knight.resistance opponent status
              severity = Events.resist resistance <| statusStrength strength
              duration = Knight.Status.duration status severity
              fire = Knight.Status.fireDamage severity
              fireTicks = Knight.Status.fireTicks severity
              totalFire = Knight.Status.fireTotal severity
              poison = Knight.Status.poisonFactor severity
              shockDefence =
                ( opponent
                  |> Knight.defences True
                  |> find (\def -> Tuple.first def == Elemental)
                  |> Maybe.withDefault (Elemental, 0)
                  |> Tuple.second
                ) * defenceModifier side left right history
              cursedVials = Knight.Status.curseVials severity
              cursedWeapons = Knight.Status.curseSlots severity
              curseDamage = Knight.Status.curseDamage severity
              spasmDamage = Knight.Status.shockDamage
              spasmDuration = Knight.Status.spasm severity
              stun = Knight.Status.stunFactor severity
              description =
              (
                  div []
                    [ text "Lasts for "
                    , span [ class "status-duration" ]
                      [ text <| pretty duration ]
                    , text " seconds"
                    ]
                ) ::
                case status of
                  Fire ->
                    [ div [] 
                      [ text "Suffer burns "
                      , span [ class "status-effect" ]
                        [ toText fireTicks ]
                      , text " times"
                      ]
                    , div []
                      [ text "Burn deals "
                      , span [ class "status-effect" ]
                        [ toText <| fire ]
                      , text " damage"
                      ]
                    , div []
                      [ text "Total: "
                      , span [ class "status-effect" ]
                        [ toText <| totalFire ]
                      ]
                    ]
                  Freeze ->
                    [ div [] 
                      [ text "Cannot "
                      , span [ class "status-effect" ] [ text "move" ]
                      ]
                    ]
                  Poison ->
                    [ div []
                      [ text "Damage reduced "
                      , span [ class "status-effect" ]
                        [ text <| (pretty poison) ++ "%" ]
                      ]
                    , div []
                      [ text "Defence reduced "
                      , span [ class "status-effect" ]
                        [ text <| (pretty <| poison / 2) ++ "%" ]
                      ]
                    , div [] 
                      [ text "Cannot "
                      , span [ class "status-effect" ] [ text "heal" ]
                      ]
                    ]
                  Shock ->
                    [ div []
                      [ text "Random shock spasms" ]
                    , div []
                      [ text "Spasm last for "
                      , span [ class "status-effect" ]
                        [ text <| pretty spasmDuration ]
                      , text " seconds"
                      ]
                    , div [] 
                      [ text "Spams inflict  "
                      , span [ class "status-effect" ]
                        [ toText <| ceiling <| defend shockDefence spasmDamage ]
                      , text " damage"
                      ]
                    ]
                  Stun ->
                    [ div []
                      [ text "Speed reduced "
                      , span [ class "status-effect" ]
                        [ text <| (pretty stun) ++ "%" ]
                      ]
                    ]
                  Curse ->
                    [ div []
                      [ text "Curse "
                      , span [ class "status-effect" ] [ toText cursedWeapons ]
                      , text " random weapons"
                      ]
                    , div []
                      [ text "Curse "
                      , span [ class "status-effect" ] [ toText cursedVials ]
                      , text " random vial slots"
                      ]
                    , div []
                      [ text "Suffer "
                      , span [ class "status-effect" ] [ toText curseDamage ]
                      , text " damage if used"
                      ]
                    ]
                  Deathmark ->
                    [ text "All defences nullified" ]
                  _ -> []
            in
              div [ class <| "event " ++ (toString side) ]
                [ div [ class "infliction flow header" ]
                  [ div [ class "knight-name" ] [ text <| .name <| knight ]
                  , button index
                  ]
                , div [ class "infliction flow" ]
                  [ (
                    if status == Deathmark then
                      div [] []
                    else if severity < -6 then
                      div [ class "infliction-strength immune" ]
                        [ text <| "Immune!" ]
                    else
                      div [ class "infliction-strength" ]
                        [ toText <| severity ]
                    )
                  , div [ class <| "infliction-status status " ++ toString status ]
                    [ toText status ]
                  ]
                , (
                  if severity < -6 then
                    div [] []
                  else
                    div [ class "infliction-description" ] description
                  )
                ]
          Recovery status ->
            div [ class <| "event " ++ (toString side) ]
              [ div [ class "recovery flow header" ]
                [ div [ class "knight-name" ] [ text <| .name <| knight ]
                , button index
                ]
              , div [ class "recovery flow" ]
                [ div [ class "recovery label" ] [ text "Recovery" ]
                , div [ class <| "recovery-status status " ++ toString status ]
                  [ toText status ]
                ]
              ]
  in
    div [ class "events" ] <| eventLog 0 [] events
