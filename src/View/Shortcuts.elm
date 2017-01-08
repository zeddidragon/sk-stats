module View.Shortcuts exposing (..)
import Html exposing (..)
import Html.Attributes exposing (selected, attribute)

selectList things current =
  select [] (List.map (selectOption current) things)

selectOption current thing =
  option [selected (current == thing)] [text thing.name]

