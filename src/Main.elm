import Html exposing (div, button, text)
import Html.Events exposing (onClick)
import Swords exposing (swords)
import Armour exposing (armours)
import Types exposing (Model, WeaponEquip, ArmourEquip)

main =
  Html.beginnerProgram {model = model, view = view, update = update}

model =
  { weapon = Swords.leviathan
  , helmet = Armour.cobalt
  , armour = Armour.cobalt
  }

view model =
  div []
    [ div [] [text model.weapon.name]
    , div [] [text model.helmet.name]
    , div [] [text model.armour.name]
    ]

update msg model =
  model

