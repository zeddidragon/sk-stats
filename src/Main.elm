import Html exposing (div, node)
import Html.Attributes exposing (class, attribute, name, content)
import Knight exposing (Knight)
import Knight.Form exposing (form)
import Knight.Stats exposing (stats)
import Events exposing (Side(Left, Right), Event)
import Events.View exposing (log)
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
    addEvent side event = SetEvents ((side, event) :: model.events)
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
            [ form EquipLeft model.left
            , stats Nothing Left model.left model.right []
            ]
          Vs ->
            [ stats (Just (addEvent Left)) Left model.left model.right model.events
            , log SetEvents model.events model.left model.right
            , stats (Just (addEvent Right)) Right model.left model.right model.events
            ]
          Opponent ->
            [ stats Nothing Right model.left model.right []
            , form EquipRight model.right
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
