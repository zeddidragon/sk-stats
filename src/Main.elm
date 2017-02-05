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
  , state = Vs
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
        ( case model.state of
          You -> 
            [ Knight.View.form EquipYou model.you
            , Knight.View.stats False model.you
            ]
          Vs ->
            [ Knight.View.stats True model.you
            , Knight.View.stats True model.opponent
            ]
          Opponent ->
            [ Knight.View.stats False model.opponent
            , Knight.View.form EquipOpponent model.opponent
            ]
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
