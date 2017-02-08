import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.View
import Events exposing (..)
import Events.View
import View.Shortcuts exposing (tabs)

main =
  Html.beginnerProgram {model = model, view = view, update = update}

model =
  { left = Knight.you
  , right = Knight.opponent
  , state = Vs
  , events = []
  }

view model =
  let
    stateToLabel state =
      case state of
        You -> model.left.name
        Vs -> "vs"
        Opponent -> model.right.name
    addEvent side event = SetEvents (model.events ++ [ (side, event) ])
    leftEvents = model.events
    rightEvents = model.events
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
      , div [ class "state-tabs" ]
        [ tabs stateToLabel toString SetState [You, Vs, Opponent] model.state
        ]
      , div [ class ("main " ++ toString model.state) ]
        ( case model.state of
          You -> 
            [ Knight.View.form EquipLeft model.left
            , Knight.View.stats Nothing Left model.left model.right []
            ]
          Vs ->
            [ Knight.View.stats (Just (addEvent Left)) Left model.left model.right model.events
            , Events.View.log SetEvents model.events model.left model.right
            , Knight.View.stats (Just (addEvent Right)) Right model.left model.right model.events
            ]
          Opponent ->
            [ Knight.View.stats Nothing Right model.left model.right []
            , Knight.View.form EquipRight model.right
            ]
        )
      ]

update msg model =
  case msg of
    EquipLeft new -> {model | left = new}
    EquipRight new -> {model | right = new}
    SetEvents new -> {model | events = new}
    SetState new -> {model | state = new}

type Msg
  = EquipLeft Knight
  | EquipRight Knight
  | SetState State
  | SetEvents (List (Side, Event))

type State
  = You
  | Opponent
  | Vs
