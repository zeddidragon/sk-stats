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
import Util exposing (find, remove)

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
              poison = Knight.Status.poisonModifier severity
              description =
              (
                  div []
                    [ text "Lasts for "
                    , span [ class "status-duration" ] [ toText duration ]
                    , text " seconds"
                    ]
                ) ::
                case status of
                  Deathmark ->
                    [ text "All defences nullified" ]
                  Poison ->
                    [ div []
                      [ text "Damage reduced "
                      , span [ class "status-effect" ]
                        [ text <| (toString poison) ++ "%" ]
                      ]
                    , div []
                      [ text "Defence reduced "
                      , span [ class "status-effect" ]
                        [ text <| (toString <| poison / 2) ++ "%" ]
                      ]
                    , div [ class "status-effect" ]
                      [ text "Cannot heal" ]
                    ]
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
