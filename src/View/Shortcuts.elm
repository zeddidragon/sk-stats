module View.Shortcuts exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (on, targetValue, onClick)
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
  let
    scale = value / max
    shift = (100 * value / max) - 100
  in
    div [ class ("bar-container " ++ color) ]
      [ div [ class "bar-bg" ] []
      , div
          [ class "bar-fill"
          , style [ ("transform" , "scaleX(" ++ (toString scale) ++ ")") ]
          ]
          []
      ]

toText arg = arg |> toString |> text

spacer = div [ class "spacer" ] []

tabs : (a -> String) -> (a -> String) -> (a -> b) -> List a -> a -> Html b
tabs toLabel toClass message items selected =
  let
    isSelected item = if selected == item then " selected" else ""
    tab item =
      div
        [ class <| "tab " ++ toClass item ++ isSelected item
        , onClick <| message item
        ] [ text <| toLabel item]
  in
    div [ class "tabs" ] <| List.map tab items

button attributes = div <| [ class "button" ] ++ attributes
