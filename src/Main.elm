import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.View
import BaseTypes exposing (..)
import Msg exposing (..)

main =
  Html.beginnerProgram {model = model, view = view, update = update}

type alias Model =
  { you : Knight
  }

model : Model
model =
  { you = Knight.you
  }

view model =
  div [class "body"]
    [ node "link"
      [ attribute "rel" "stylesheet"
      , attribute "type" "text/css"
      , attribute "href" "styles.css"
      ]
     []
    , div [class "main"]
      [ Knight.View.form model.you
      , Knight.View.stats model.you
      ]
    ]

update msg model =
  case msg of
    EquipWeapon equip ->
      let
        you = model.you
        weapon = you.weapon
      in
        {model | you = {you | weapon = {weapon | weapon = equip}}}
    EquipHelmet equip ->
      let
        you = model.you
        helmet = you.helmet
      in
        {model | you = {you | helmet = {helmet | armour = equip}}}
    EquipArmour equip ->
      let
        you = model.you
        armour = you.armour
      in
        {model | you = {you | armour = {armour | armour = equip}}}

