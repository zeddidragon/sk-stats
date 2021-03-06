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
import Base64
import Util exposing (query, queryValue, querify, btoa, orMaybe)
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
  , left : String
  , leftName : Maybe String
  , right : String
  , rightName : Maybe String
  }

init : Flags -> (Model, Cmd Msg)
init flags =
  let
    rename name knight =
      { knight
      | name = name
      }
    readName attr =
      queryValue flags.qs attr
        |> Maybe.map Base64.decode
        |> Maybe.map (Result.withDefault "Decoded")
    leftName =
      readName "leftname"
        |> orMaybe flags.leftName
        |> Maybe.withDefault "Left"
    rightName =
      readName "rightname"
        |> orMaybe flags.rightName
        |> Maybe.withDefault "Right"
    left =
      queryValue flags.qs "left"
        |> Maybe.andThen decode
        |> orMaybe (decode flags.left)
        |> Maybe.map (rename leftName)
        |> Maybe.withDefault Knight.you
    right =
      queryValue flags.qs "right"
        |> Maybe.andThen decode
        |> orMaybe (decode flags.right)
        |> Maybe.map (rename rightName)
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
    left =
      [ ("left", encode model.left)
      , ("leftname", btoa model.left.name)
      ]
    right =
      [ ("right", encode model.right)
      , ("rightname", btoa model.right.name)
      ]
    shareData =
      case model.state of
        You -> left
        Vs -> left ++ right
        Opponent -> right
    buttonText = if model.state == Vs then "Share Duel" else "Share Loadout"
  in
    div [class "body"]
      [ div [ class "state-tabs" ]
        [ tabs stateToLabel toString SetState [You, Vs, Opponent] model.state ]
      , div [ class "state-url" ]
        [ div
          [ class "button clipboard"
          , attribute "data-clipboard-target" "#url"
          ] [ text buttonText ]
        , input
          [ id "url"
          , class "url"
          , readonly True
          , value <| model.path ++ "?" ++ querify shareData
          ] []
        ]
      , div [ class ("main " ++ toString model.state) ]
        ( case model.state of
          You -> 
            [ form model.loadouts SaveLoadout EquipLeft model.left
            , stats Nothing Left model.left model.right []
            ]
          Vs ->
            [ stats (Just (addEvent Left)) Left model.left model.right model.events
            , log SetEvents model.events model.left model.right
            , stats (Just (addEvent Right)) Right model.left model.right model.events
            ]
          Opponent ->
            [ stats Nothing Right model.left model.right []
            , form model.loadouts SaveLoadout EquipRight model.right
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
        Loadouts pairs ->
          let
            new =
              pairs
                |> List.filter (\(name, data) -> String.startsWith "loadout|" name)
                |> List.map (\(name, data)-> (String.dropLeft 8 name, data))
          in
            {model | loadouts = new}
        SaveLoadout _ -> model
    cmd =
      case msg of
        SaveLoadout (name, data) -> lsSave [("loadout|" ++ name, data)]
        EquipLeft new ->
          lsSave
            [ ("leftName", new.name)
            , ("left", encode new)
            ]
        EquipRight new ->
          lsSave
            [ ("rightName", new.name)
            , ("right", encode new)
            ]
        _ -> Cmd.none
  in
    (next, cmd)

subscriptions : Model -> Sub Msg
subscriptions model = lsData Loadouts

type Msg
  = EquipLeft Knight
  | EquipRight Knight
  | SetState State
  | SetEvents (List (Side, Event))
  | Loadouts (List (String, String))
  | SaveLoadout (String, String)

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

