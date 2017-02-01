module View.Shortcuts exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, targetValue)
import Json.Decode

signal message label things current selected =
  case List.head (List.filter (\t -> label t == selected) things) of
    Just thing -> message thing
    Nothing -> message current

selectListExclude : List a -> (a -> String) -> (a -> b) -> List a -> a -> Html b
selectListExclude exclude label message things current =
  let
    selectThing = signal message label things current
  in
    select
      [ on "change" (Json.Decode.map selectThing targetValue) ]
      (List.map (selectOption exclude label current) things)

selectOption excluded label current thing =
  let
    isDisabled = List.any (\t -> label thing == label t) excluded
  in
    option
      [ label current == label thing |> selected
      , label current /= label thing && isDisabled |> disabled
      , value <| label thing
      ] [text <| label thing]

selectList = selectListExclude []

bar max color value =
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
