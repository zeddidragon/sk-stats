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
    knightName knight =
      span [ class "knight-name" ] [ text knight.name ]
    attack stage weapon =
      [ span [ class "attack-stage" ] [ toText stage ]
      , text " attack from "
      , span [ class "attack-weapon" ] [ text weapon ]
      ]
    eventLog event =
      case event of
        Attack (side, weaponName, stage)->
          [ div [ class "event" ] (
            [ knightName <| knight side
            , text " hit "
            , knightName <| opponent side
            , text " with a "
            ]
            ++ attack stage weaponName
            )
          ]
        _ -> []
  in
    div [ class "events" ] <| List.concatMap eventLog events
