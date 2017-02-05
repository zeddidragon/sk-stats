import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.View
import View.Shortcuts exposing (tabs)

main =
  Html.beginnerProgram {model = model, view = view, update = update}

model =
  { you = Knight.you
  , opponent = Knight.opponent
  , state = You
  }

view model =
  let
    stateToLabel state =
      case state of
        You -> model.you.name
        Vs -> "vs"
        Opponent -> model.opponent.name
  in
    div [class "body"]
      [ node "link"
        [ attribute "rel" "stylesheet"
        , attribute "type" "text/css"
        , attribute "href" "styles.css"
        ] []
      , node "meta"
        [ name "viewport"
        , content "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        ] []
      , div [ class "tabs" ]
        [ tabs stateToLabel toString SetState [You, Vs, Opponent] model.state
        ]
      , div [ class "main" ]
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
    SetState new -> {model | state = new}

type Msg
  = EquipYou Knight
  | EquipOpponent Knight
  | SetState State

type State
  = You
  | Opponent
  | Vs
