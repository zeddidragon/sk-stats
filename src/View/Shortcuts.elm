module View.Shortcuts exposing (..)
import Html exposing (..)
import Html.Attributes exposing (selected, attribute, class, style, value)
import Html.Events exposing (on, targetValue)
import Json.Decode

signal message things current name =
  case List.head (List.filter (\t -> t.name == name) things) of
    Just thing -> message thing
    Nothing -> message current

selectList message things current =
  let
    selectThing = signal message things current
  in
    select
      [ on "change" (Json.Decode.map selectThing targetValue) ]
      (List.map (selectOption current) things)

selectOption current thing =
  option
    [ selected (current == thing)
    , value thing.name
    ] [text thing.name]

bar color value max =
  div [ class ("bar-container " ++ color) ]
    [ div [ class "bar-bg" ] []
    , div
        [ class "bar-fill"
        , style [ ("width", (toString (100 * value / max)) ++ "%") ]
        ]
        []
    ]
