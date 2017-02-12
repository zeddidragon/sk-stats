import Html exposing (Html, programWithFlags, div, node)
import Html.Attributes exposing (class, attribute, name, content)
import Knight exposing (Knight)
import Knight.Form exposing (form)
import Knight.Stats exposing (stats)
import Events exposing (Side(Left, Right), Event)
import Events.View exposing (log)
import View.Shortcuts exposing (tabs)

main : Program Flags Model Msg
main =
  programWithFlags
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

type alias Flags =
  { qs : String }

init : Flags -> (Model, Cmd Msg)
init flags =
  let
    model =
      { query = ""
      , left = Knight.you
      , right = Knight.opponent
      , state = Vs
      , events = []
      }
  in
    (model, Cmd.none)

view : Model -> Html Msg
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
      [ div [ class "state-tabs" ]
        [ tabs stateToLabel toString SetState [You, Vs, Opponent] model.state ]
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

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  let
    next = 
      case msg of
        EquipLeft new -> {model | left = new}
        EquipRight new -> {model | right = new}
        SetEvents new -> {model | events = new}
        SetState new -> {model | state = new}
  in
    (next, Cmd.none)

subscriptions : Model -> Sub Msg
subscriptions model = Sub.none

type Msg
  = EquipLeft Knight
  | EquipRight Knight
  | SetState State
  | SetEvents (List (Side, Event))

type State
  = You
  | Opponent
  | Vs

type alias Model =
  { query : String
  , left : Knight
  , right : Knight
  , state : State
  , events : List (Side, Event)
  }

