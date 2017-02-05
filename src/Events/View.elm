module Events.View exposing (log)

import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import View.Shortcuts exposing (toText)

log message events knights =
  let
    opponent knight =
      knights
        |> List.filter (\k -> k /= knight)
        |> List.head
        |> Maybe.withDefault Knight.you
  in
    div [ class "events" ] <| List.map toText events
