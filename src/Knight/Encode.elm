module Knight.Encode exposing (..)

import String
import Knight exposing (Knight)
import Knight.Swords exposing (sword)
import Knight.UV exposing (..)
import Knight.Status exposing (Status(..))
import Util exposing (index)
import Base64

decode : String -> Maybe Knight
decode code =
  case Base64.decode code of
    Result.Ok seed ->
      case String.split " " seed of
        shield :: helmet :: armour :: weapons :: trinkets ->
          let
            bonuses =
              [ NegMaximum
              , Low
              , Medium
              , High
              , VeryHigh
              , Ultra
              , Maximum
              ]
            decodeUv str =
              let
                strength =
                  str
                    |> String.right 1
                    |> String.toInt
                    |> Result.withDefault 0
                    |> (flip Util.atIndex) bonuses
                    |> Maybe.withDefault NegMaximum
              in
                (Fire, strength)
            decodeWeapon str =
              let
                id =
                  str
                    |> String.split "+"
                    |> List.head
                    |> Maybe.withDefault "sword"
                piece =
                  Knight.weapons
                    |> Util.find (\wpn -> wpn.id == id)
                    |> Maybe.withDefault sword
                uvs =
                  str
                    |> String.split "+"
                    |> List.drop 1
                    |> List.map decodeUv
              in
                { piece = piece
                , uvs = uvs
                }
            weapons_ =
              weapons
                |> String.split "|"
                |> List.map decodeWeapon
          in
            Nothing
            {-
            Just
              { name = "Encoded"
              , weapons = weapons_
              , helmet = helmet_
              , armour = armour_
              , shield = shield_
              , trinkets = trinkets_
              }
            --}
        _ -> Nothing
    _ -> Nothing

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
    raw = 
      String.join " "
        [ shield
        , gear
        , weapons
        , trinkets
        ]
  in
    case Base64.encode raw of
      Result.Ok ret -> raw
      Result.Err err -> err

