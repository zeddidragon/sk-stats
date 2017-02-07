module Events.View exposing (log)

import Events exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.Swords exposing (leviathan)
import View.Shortcuts exposing (toText)

log message events left right =
  let
    knight side = if side == Left then left else right
    opponent side = if side == Left then right else left
    weapon name =
      weapons
        |> List.filter (\w -> w.name == name)
        |> List.head
        |> Maybe.withDefault leviathan
    eventLog event =
      case event of
        Attack (side, weaponName, stage)->
          [ div [ class <| "event " ++ (toString side) ]
            [ div [ class "attack-flow header" ]
              [ div [ class "knight-name" ] [ text <| .name <| knight side ]
              , div [ class "weapon" ] [ text weaponName ]
              ]
            , div [ class "attack-flow" ]
              [ div [ class "attack-stage" ] [ toText stage ]
              , div [ class "attack-damage" ] [ text "100" ]
              ]
            ]
          ]
        _ -> []
  in
    div [ class "events" ] <| List.concatMap eventLog events
