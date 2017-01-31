module View.Shortcuts exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, targetValue)
import Json.Decode

signal message things current name =
  case List.head (List.filter (\t -> t.name == name) things) of
    Just thing -> message thing
    Nothing -> message current

selectListExclude exclude message things current =
  let
    selectThing = signal message things current
  in
    select
      [ on "change" (Json.Decode.map selectThing targetValue) ]
      (List.map (selectOption exclude current) things)

selectOption excluded current thing =
  let
    label = thing.name
    isDisabled = List.any (\t -> thing.name == t.name) excluded
  in
    option
      [ current.name == thing.name |> selected
      , current.name /= thing.name && isDisabled |> disabled
      , value label
      ] [text label]

selectList = selectListExclude []

bar color value max =
  div [ class ("bar-container " ++ color) ]
    [ div [ class "bar-bg" ] []
    , div
        [ class "bar-fill"
        , style [ ("width", (toString (100 * value / max)) ++ "%") ]
        ]
        []
    ]

toText arg = arg |> toString |> text

spacer = div [ class "spacer" ] []
