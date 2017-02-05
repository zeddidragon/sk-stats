import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.View

main =
  Html.beginnerProgram {model = model, view = view, update = update}

model =
  { you = Knight.you
  , opponent = Knight.opponent
  , state = You
  }

view model =
  div [class "body"]
    [ node "link"
      [ attribute "rel" "stylesheet"
      , attribute "type" "text/css"
      , attribute "href" "styles.css"
      ]
     []
    , node "meta"
      [ name "viewport"
      , content "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      ]
    []
    , div [class "main"]
      ( (
        if model.state == You then
          [ Knight.View.form EquipYou model.you ]
        else
          []
        ) 
      ++
        [ Knight.View.stats model.you
        , Knight.View.stats model.opponent
        ]
      ++ (
        if model.state == Opponent then
          [ Knight.View.form EquipOpponent model.opponent ]
        else
          []
        )
      )
    ]

update msg model =
  case msg of
    EquipYou new -> {model | you = new}
    EquipOpponent new -> {model | opponent = new}

type Msg
  = EquipYou Knight
  | EquipOpponent Knight

type State
  = You
  | Opponent
  | Vs
