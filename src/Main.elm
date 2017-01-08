import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.View

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
  div
    [ style
      [ ("display", "flex")
      , ("color", "white")
      , ("background-color", "black")
      , ("height", "100%")
      ]
    ]
    [ Knight.View.form model.you
    , Knight.View.stats model.you
    ]

update msg model =
  model
