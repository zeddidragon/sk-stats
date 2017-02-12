module Knight.Encode exposing (..)

import Knight exposing (Knight)
import Knight.UV exposing (..)
import Util exposing (index)

encode : Knight -> String
encode knight =
  let
    uvNum strength =
      [NegLow, Low, Medium, High, VeryHigh, Ultra, Maximum]
        |> index strength 
        |> Maybe.withDefault 0
    uvString effect =
      let
        parts =
          case effect of
            WeaponUV (bonus, str)->
              [ String.left 2 <| toString bonus
              , toString <| uvNum str
              ]
            StatusUV (status, str)->
              [ String.left 2 <| toString status
              , toString <| uvNum str]
            DefenceUV (dType, str)->
              [ String.left 1 <| toString dType
              , String.right 1 <| toString dType
              , toString <| uvNum str
              ]
            _ ->
              []
      in
        parts
          |> List.map String.toLower
          |> String.join ""
    slotString slot =
      slot.uvs
        |> List.map uvString
        |> (::) slot.piece.id
        |> String.join "+"
    weapons =
      knight.weapons
        |> List.map slotString
        |> String.join "|"
    shield =
      knight.shield
        |> slotString
    gear =
      [ knight.helmet, knight.armour ]
        |> List.map slotString
        |> String.join " "
    trinkets =
      knight.trinkets
        |> List.map .id
        |> String.join "|"
  in
    String.join " "
      [ shield
      , gear
      , weapons
      , trinkets
      ]

