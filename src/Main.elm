import Html exposing (Html, programWithFlags, div, node, input, text)
import Html.Attributes exposing
  ( id
  , class
  , attribute
  , name
  , content
  , readonly
  , value
  )
import Util exposing (query, queryValue, querify)
import Knight exposing (Knight)
import Knight.Form exposing (form)
import Knight.Stats exposing (stats)
import Knight.Encode exposing (decode, encode)
import Events exposing (Side(Left, Right), Event)
import Events.View exposing (log)
import View.Shortcuts exposing (tabs)
import LocalStorage exposing (lsSave, lsData)

main : Program Flags Model Msg
main =
  programWithFlags
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

type alias Flags =
  { qs : String
  , path : String
  }

init : Flags -> (Model, Cmd Msg)
init flags =
  let
    rename name knight =
      { knight
      | name = name
      }
    left =
      queryValue flags.qs "left"
        |> Maybe.andThen decode
        |> Maybe.map (rename "Left")
        |> Maybe.withDefault Knight.you
    right =
      queryValue flags.qs "right"
        |> Maybe.andThen decode
        |> Maybe.map (rename "Right")
        |> Maybe.withDefault Knight.opponent
    model =
      { path = flags.path
      , left = left
      , right = right
      , state = Vs
      , events = []
      , loadouts = []
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
      , div [ class "state-url" ]
        [ div
          [ class "button clipboard"
          , attribute "data-clipboard-target" "#url"
          ] [ text "Share Loadouts" ]
        , input
          [ id "url"
          , class "url"
          , readonly True
          , value <| (++) (model.path ++ "?") <| querify
            [ ("left", encode model.left)
            , ("right", encode model.right)
            ]
          ] []
        ]
      , div [ class ("main " ++ toString model.state) ]
        ( case model.state of
          You -> 
            [ form model.loadouts EquipLeft model.left
            , stats Nothing Left model.left model.right []
            ]
          Vs ->
            [ stats (Just (addEvent Left)) Left model.left model.right model.events
            , log SetEvents model.events model.left model.right
            , stats (Just (addEvent Right)) Right model.left model.right model.events
            ]
          Opponent ->
            [ stats Nothing Right model.left model.right []
            , form model.loadouts EquipRight model.right
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
        Loadouts new -> { model | loadouts = new}
  in
    (next, Cmd.none)

subscriptions : Model -> Sub Msg
subscriptions model = lsData Loadouts

type Msg
  = EquipLeft Knight
  | EquipRight Knight
  | SetState State
  | SetEvents (List (Side, Event))
  | Loadouts (List (String, String))

type State
  = You
  | Opponent
  | Vs

type alias Model =
  { path : String
  , left : Knight
  , right : Knight
  , state : State
  , events : List (Side, Event)
  , loadouts : List (String, String)
  }

