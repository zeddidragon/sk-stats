module Knight.Encode exposing (..)

import String
import Knight exposing (Knight)
import Knight.Swords exposing (sword)
import Knight.Armour exposing (base, armours)
import Knight.Shield exposing (shields, aegis)
import Knight.Trinket
import Knight.UV exposing (..)
import Knight.Status exposing (Status(..))
import Util exposing (index, find, strReplace)
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
                id = String.dropRight 1 str
                bonusIds =
                  [ ("cr", WeaponUV (CTR, strength))
                  , ("ai", WeaponUV (ASI, strength))
                  , ("bt", WeaponUV (Beast, strength))
                  , ("fd", WeaponUV (Fiend, strength))
                  , ("gn", WeaponUV (Gremlin, strength))
                  , ("se", WeaponUV (Slime, strength))
                  , ("ct", WeaponUV (Construct, strength))
                  , ("ud", WeaponUV (Undead, strength))

                  , ("nl", DefenceUV (Normal, strength))
                  , ("pg", DefenceUV (Piercing, strength))
                  , ("el", DefenceUV (Elemental, strength))
                  , ("sw", DefenceUV (Shadow, strength))

                  , ("fi", StatusUV (Fire, strength))
                  , ("fr", StatusUV (Freeze, strength))
                  , ("sh", StatusUV (Shock, strength))
                  , ("po", StatusUV (Poison, strength))
                  , ("st", StatusUV (Stun, strength))
                  , ("cu", StatusUV (Curse, strength))
                  ]
              in
                case bonusIds |> find (\(bonusId, bonus) -> id == bonusId) of
                  Just (id, uv) -> Just uv
                  _ -> Nothing
            id str =
              str
                |> String.split "+"
                |> List.head
                |> Maybe.withDefault ""
            uvs str =
              str
                |> String.split "+"
                |> List.drop 1
                |> List.filterMap decodeUv
            piece items str = find (\item -> item.id == id str) items
            decodeWeapon str =
              { piece = piece Knight.weapons str |> Maybe.withDefault sword
              , uvs = uvs str
              }
            decodeArmour str =
              { piece = piece armours str |> Maybe.withDefault base
              , uvs = uvs str
              }
            decodeShield str =
              { piece = piece shields str |> Maybe.withDefault aegis
              , uvs = uvs str
              }
            decodeTrinket str =
              piece Knight.Trinket.trinkets str
          in
            Just
              { name = "Encoded"
              , weapons = weapons
                |> String.split "|"
                |> List.map decodeWeapon
              , helmet = decodeArmour helmet
              , armour = decodeArmour armour
              , shield = decodeShield shield
              , trinkets = trinkets
                |> List.head
                |> Maybe.withDefault ""
                |> String.split "|"
                |> List.filterMap decodeTrinket
              }
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
              [ String.left 1 <| toString bonus
              , String.right 1 <| toString bonus
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
      Result.Ok ret -> strReplace raw "=" ""
      Result.Err err -> err

